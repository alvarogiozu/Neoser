import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmailAutomationSchema } from "@/lib/schemas";
import { sendEmail } from "@/lib/email";

function renderTemplate(templateKey: string, variables: Record<string, string> = {}) {
  const fullName = variables.fullName || "NeoSer";

  const templates: Record<string, { subject: string; html: string }> = {
    bienvenida_lead: {
      subject: "Gracias por contactarte con NeoSer",
      html: `<p>Hola ${fullName},</p><p>Gracias por escribirnos. En breve te ayudamos con tu consulta.</p>`,
    },
    confirmacion_reserva: {
      subject: "Reserva recibida en NeoSer",
      html: `<p>Hola ${fullName},</p><p>Recibimos tu reserva. Te confirmaremos el horario final en breve.</p>`,
    },
    seguimiento_general: {
      subject: "Seguimiento de tu solicitud en NeoSer",
      html: `<p>Hola ${fullName},</p><p>Estamos realizando seguimiento de tu solicitud para ayudarte en todo el proceso.</p>`,
    },
  };

  return (
    templates[templateKey] || {
      subject: "Mensaje de NeoSer",
      html: `<p>Hola ${fullName},</p><p>Tenemos una actualizacion de tu solicitud.</p>`,
    }
  );
}

export async function POST(request: NextRequest) {
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
    const parsed = sendEmailAutomationSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const template = renderTemplate(parsed.data.templateKey, parsed.data.variables);
    const sendResult = await sendEmail({
      to: parsed.data.to,
      subject: template.subject,
      html: template.html,
    });

    const serviceClient = createServiceClient();
    await serviceClient.from("email_events").insert({
      lead_id: parsed.data.leadId ?? null,
      booking_id: parsed.data.bookingId ?? null,
      provider: sendResult.provider,
      template_key: parsed.data.templateKey,
      recipient_email: parsed.data.to,
      status: sendResult.status,
      metadata: sendResult.data,
    });

    return NextResponse.json({ ok: true, status: sendResult.status, provider: sendResult.provider });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo disparar automatizacion email", details: String(error) },
      { status: 500 },
    );
  }
}

