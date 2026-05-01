import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsappTemplate } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/server";

const sendTemplateSchema = z.object({
  to: z.string().min(8).max(20),
  template: z.string().min(3).max(100),
  params: z.array(z.object({ type: z.literal("text"), text: z.string().min(1) })).optional(),
});

export async function POST(request: NextRequest) {
  // Admin-only: sending WhatsApp messages on behalf of NeoSer.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const parsed = sendTemplateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const data = await sendWhatsappTemplate(
      parsed.data.to,
      parsed.data.template,
      parsed.data.params ?? [],
    );

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo enviar mensaje", details: String(error) }, { status: 500 });
  }
}
