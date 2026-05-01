import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getMercadoPagoPaymentById } from "@/lib/payments/mercadopago";

function normalizeStatus(status: string) {
  switch (status) {
    case "approved":
      return "approved";
    case "in_process":
    case "pending":
      return "pending";
    case "rejected":
    case "cancelled":
      return "rejected";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending";
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
    const paymentId =
      url.searchParams.get("id") ?? url.searchParams.get("data.id") ?? "";

    if (!topic || topic !== "payment" || !paymentId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const paymentDetails = await getMercadoPagoPaymentById(paymentId);
    const normalized = normalizeStatus(paymentDetails.status);
    const supabase = createServiceClient();

    const externalReference = paymentDetails.external_reference;
    if (!externalReference) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id,enrollment_id,lead_id")
      .eq("id", externalReference)
      .maybeSingle();

    if (!existingPayment) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    await supabase
      .from("payments")
      .update({
        provider_payment_id: String(paymentDetails.id),
        status: normalized,
        paid_at: normalized === "approved" ? new Date().toISOString() : null,
        raw_payload: paymentDetails,
      })
      .eq("id", existingPayment.id);

    if (normalized === "approved") {
      await supabase
        .from("enrollments")
        .update({ status: "paid" })
        .eq("id", existingPayment.enrollment_id);

      if (existingPayment.lead_id) {
        await supabase
          .from("contact_leads")
          .update({ lead_status: "inscrito" })
          .eq("id", existingPayment.lead_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("payments/webhook error", error);
    return NextResponse.json({ error: "Error webhook" }, { status: 500 });
  }
}
