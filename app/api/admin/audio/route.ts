import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_AUDIO_MIME = new Set(["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav", "audio/x-wav", "audio/m4a", "audio/mp4", "audio/aac"]);
const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB

// Upload a backsound file to the dedicated `invitation-audio` bucket. Only
// admins can hit this — RLS on the bucket enforces it as a second layer.
export async function POST(request: Request) {
  try { await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  if (!ALLOWED_AUDIO_MIME.has(file.type.toLowerCase())) {
    return NextResponse.json({ error: "Format harus MP3, OGG, WAV, atau M4A." }, { status: 400 });
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Ukuran maksimal 12MB." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "mp3";
  const path = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("invitation-audio")
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: "Upload gagal." }, { status: 400 });

  const { data } = supabase.storage.from("invitation-audio").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
