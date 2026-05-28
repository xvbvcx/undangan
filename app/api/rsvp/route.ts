import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  invitationId: z.string().uuid(),
  name: z.string().min(1),
  attendance: z.string(),
  message: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Data RSVP tidak valid." }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await supabase.from("rsvps").insert({
    invitation_id: parsed.data.invitationId,
    guest_name: parsed.data.name,
    attendance: parsed.data.attendance,
    message: parsed.data.message || ""
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
