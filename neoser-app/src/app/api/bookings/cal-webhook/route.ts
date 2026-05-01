import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { calBookingWebhookSchema } from "@/lib/schemas";
import { verifyCalWebhookSignature } from "@/lib/cal";
import { syncBookingToHubspot } from "@/lib/hubspot";
import { sendEmail } from "@/lib/email";

function mapBookingStatus(status?: string): "pending" | "confirmed" | "cancelled" | "rescheduled" {
  switch ((status || "").toLowerCase()) {
    case "accepted":
    case "confirmed":
      return "confirmed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "rescheduled":
      return "rescheduled";
    default:
      return "pending";
  }
}

function getAttendee(payload: { attendees?: Array<{ name?: string; email?: string; phoneNumber?: string }> }) {
  return payload.attendees?.[0];
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-cal-signature-256") ||
    request.headers.get("x-cal-signature");

  if (!verifyCalWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  const parsed = calBookingWebhookSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload no soportado" }, { status: 400 });
  }

  const { payload } = parsed.data;
  const attendee = getAttendee(payload);
  const bookingStatus = mapBookingStatus(payload.status ?? parsed.data.triggerEvent);
  const supabase = createServiceClient();

  const upsertPayload = {
    cal_booking_uid: payload.uid,
    full_name: attendee?.name || "Reserva Web NeoSer",
    email: attendee?.email || null,
    phone: attendee?.phoneNumber || "000000000",
    booking_status: bookingStatus,
    cal_event_type_id: payload.eventTypeId ?? null,
    cal_starts_at: payload.startTime ?? null,
    cal_ends_at: payload.endTime ?? null,
    source: "cal_webhook",
  };

  const { data: booking, error } = await supabase
    .from("bookings")
    .upsert(upsertPayload, { onConflict: "cal_booking_uid" })
    .select("*")
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "No se pudo guardar reserva" }, { status: 500 });
  }

  try {
    await syncBookingToHubspot({
      bookingId: booking.id,
      fullName: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      serviceInterest: booking.service_interest || undefined,
      preferredDate: booking.preferred_date || undefined,
      preferredTime: booking.preferred_time || undefined,
    });
  } catch (syncError) {
    console.error("HubSpot booking sync (cal webhook) failed:", syncError);
  }

  if (booking.email && bookingStatus === "confirmed") {
    try {
      const sendResult = await sendEmail({
        to: booking.email,
        subject: "Tu cita en NeoSer fue confirmada",
        html: `<p>Hola ${booking.full_name},</p><p>Tu reserva fue confirmada para ${booking.cal_starts_at || "el horario seleccionado"}.</p>`,
      });

      await supabase.from("email_events").insert({
        booking_id: booking.id,
        provider: sendResult.provider,
        template_key: "confirmacion_reserva",
        recipient_email: booking.email,
        status: sendResult.status,
        metadata: sendResult.data,
      });
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError);
    }
  }

  return NextResponse.json({ ok: true });
}

