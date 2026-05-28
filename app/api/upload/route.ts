import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Hanya file gambar yang diperbolehkan." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Ukuran maksimal 4MB per foto." }, { status: 400 });

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from("invitation-photos").upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data } = admin.storage.from("invitation-photos").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
