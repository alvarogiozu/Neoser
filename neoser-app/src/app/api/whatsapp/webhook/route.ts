import { NextRequest, NextResponse } from "next/server";
import { sendWhatsappText } from "@/lib/whatsapp";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_SECRET) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

const OPT_OUT_KEYWORDS = ["salir", "parar", "stop", "no más", "no mas", "baja"];
const CURSO_KEYWORDS = ["curso", "clase", "taller", "capacitacion", "capacitación"];
const PRECIO_KEYWORDS = ["precio", "costo", "inversión", "inversion", "cuanto", "cuánto"];
const PAGO_KEYWORDS = ["pago", "yape", "plin", "tarjeta", "transferencia"];
const HORARIO_KEYWORDS = ["horario", "fecha", "cuando", "cuándo", "calendario"];

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Handle status updates (delivery, read receipts) — acknowledge silently
  const statuses = body?.entry?.[0]?.changes?.[0]?.value?.statuses;
  if (statuses) {
    return NextResponse.json({ ok: true });
  }

  const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
  if (!messages) return NextResponse.json({ ok: true });

  for (const message of messages) {
    const from = message?.from;
    const textBody = String(message?.text?.body ?? "").toLowerCase().trim();
    if (!from) continue;

    // 1. Opt-out: respetar inmediatamente (anti-baneo crítico)
    if (OPT_OUT_KEYWORDS.some((kw) => textBody.includes(kw))) {
      await handleOptOut(from);
      continue;
    }

    // 2. Check opt-out list before replying
    const isOptedOut = await checkOptOut(from);
    if (isOptedOut) continue;

    // 3. Route by intent
    const reply = routeReply(textBody);

    try {
      await sendWhatsappText(from, reply);
    } catch (error) {
      console.error("WhatsApp auto reply failed:", error);
    }
  }

  return NextResponse.json({ ok: true });
}

function routeReply(text: string): string {
  if (CURSO_KEYWORDS.some((kw) => text.includes(kw))) {
    return (
      "Gracias por tu interes en nuestros cursos.\n\n" +
      "En NeoSer ofrecemos formacion en maternidad y medicina humanizada.\n\n" +
      "Un asesor te enviara informacion detallada en breve.\n\n" +
      "Responde SALIR si no deseas recibir mas mensajes."
    );
  }

  if (PRECIO_KEYWORDS.some((kw) => text.includes(kw))) {
    return (
      "Con gusto te compartimos la inversion.\n\n" +
      "Indicanos que curso o servicio te interesa y te enviamos los detalles.\n\n" +
      "Responde SALIR si no deseas recibir mas mensajes."
    );
  }

  if (PAGO_KEYWORDS.some((kw) => text.includes(kw))) {
    return (
      "Puedes pagar con tarjeta, Yape o Plin.\n\n" +
      "Un asesor te enviara el enlace de pago correspondiente.\n\n" +
      "Responde SALIR si no deseas recibir mas mensajes."
    );
  }

  if (HORARIO_KEYWORDS.some((kw) => text.includes(kw))) {
    return (
      "Nuestros horarios varian segun el curso o servicio.\n\n" +
      "Indicanos cual te interesa y te compartimos las fechas disponibles.\n\n" +
      "Responde SALIR si no deseas recibir mas mensajes."
    );
  }

  return (
    "Hola, gracias por escribir a NeoSer - Maternidad y Medicina Humanizada.\n\n" +
    "Puedes consultarnos sobre:\n" +
    "- Cursos disponibles\n" +
    "- Precios e inversion\n" +
    "- Formas de pago\n" +
    "- Horarios y fechas\n\n" +
    "Un asesor te atendera en breve.\n\n" +
    "Responde SALIR si no deseas recibir mas mensajes."
  );
}

async function handleOptOut(phone: string) {
  try {
    const supabase = createServiceClient();
    await supabase.from("wa_opt_outs").upsert(
      { phone, opted_out_at: new Date().toISOString() },
      { onConflict: "phone" },
    );

    await sendWhatsappText(
      phone,
      "Has sido removido/a de nuestra lista de mensajes. No recibiras mas comunicaciones por este canal.\n\nSi cambias de opinion, escribenos nuevamente.",
    );
  } catch (error) {
    console.error("Opt-out handling failed:", error);
  }
}

async function checkOptOut(phone: string): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("wa_opt_outs")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();
    return !!data;
  } catch {
    // If table doesn't exist yet, allow messages (fail open for MVP)
    return false;
  }
}
