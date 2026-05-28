import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB raw — gets compressed before persisting
const MAX_DIMENSION = 1920;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const limiter = rateLimit({ key: `upload:${user.id}`, limit: 30, windowMs: 60_000 });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Terlalu banyak upload, coba lagi sebentar." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });

  // 1. Strict MIME whitelist (no SVG, no octet-stream, no application/*).
  const declaredType = file.type.toLowerCase();
  if (!ALLOWED_MIME.has(declaredType)) {
    return NextResponse.json({ error: "Format harus JPEG, PNG, WebP, atau HEIC." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran maksimal 8MB sebelum kompres." }, { status: 400 });
  }

  // 2. Verify magic bytes via sharp metadata. Reject anything that doesn't
  //    actually decode as one of the allowed formats.
  const buffer = Buffer.from(await file.arrayBuffer());
  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    return NextResponse.json({ error: "File rusak atau bukan gambar." }, { status: 400 });
  }

  const allowedFormats = new Set(["jpeg", "png", "webp", "heif"]);
  if (!metadata.format || !allowedFormats.has(metadata.format)) {
    return NextResponse.json({ error: "Format gambar tidak diizinkan." }, { status: 400 });
  }

  // 3. Re-encode to webp + downsize. This both strips EXIF (privacy) and
  //    drops bandwidth dramatically for typical phone photos.
  let processed: Buffer;
  try {
    processed = await sharp(buffer, { failOn: "error" })
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Gagal memproses gambar." }, { status: 400 });
  }

  // 4. Persist to a folder named after the user id so storage RLS can scope
  //    update/delete to the owner.
  const admin = createAdminClient();
  const path = `${user.id}/${randomUUID()}.webp`;
  const { error } = await admin.storage
    .from("invitation-photos")
    .upload(path, processed, { contentType: "image/webp", upsert: false });
  if (error) return NextResponse.json({ error: "Upload gagal." }, { status: 400 });

  const { data } = admin.storage.from("invitation-photos").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const _ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : null;
  if (!url) return NextResponse.json({ error: "URL wajib." }, { status: 400 });

  // Derive the storage object path from a public URL and refuse to delete
  // anything outside the caller's folder.
  const marker = "/object/public/invitation-photos/";
  const idx = url.indexOf(marker);
  if (idx === -1) return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  const path = url.slice(idx + marker.length).split("?")[0];
  if (!path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const admin = createAdminClient();
  const { error } = await admin.storage.from("invitation-photos").remove([path]);
  if (error) return NextResponse.json({ error: "Gagal menghapus." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
