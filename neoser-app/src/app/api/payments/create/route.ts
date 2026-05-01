import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentIntentSchema } from "@/lib/schemas";
import {
  createMercadoPagoPreference,
  isMercadoPagoConfigured,
} from "@/lib/payments/mercadopago";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
}

export async function POST(request: Request) {
  try {
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        { error: "Pasarela de pago no configurada" },
        { status: 503 },
      );
    }

    const appUrl = getAppUrl();
    if (!appUrl) {
      return NextResponse.json(
        { error: "Falta NEXT_PUBLIC_APP_URL para construir URLs de pago" },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = createPaymentIntentSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id,title,price,currency,is_published")
      .eq("id", parsed.data.courseId)
      .single();

    if (courseError || !course || !course.is_published) {
      return NextResponse.json({ error: "Curso no disponible" }, { status: 404 });
    }

    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id,status")
      .eq("user_id", user.id)
      .eq("course_id", parsed.data.courseId)
      .maybeSingle();

    let enrollmentId = existingEnrollment?.id;
    if (!enrollmentId) {
      const { data: insertedEnrollment, error: insertEnrollmentError } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: parsed.data.courseId,
          status: "pending",
        })
        .select("id")
        .single();

      if (insertEnrollmentError || !insertedEnrollment) {
        return NextResponse.json(
          { error: "No se pudo iniciar la matricula" },
          { status: 500 },
        );
      }
      enrollmentId = insertedEnrollment.id;
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        enrollment_id: enrollmentId,
        lead_id: parsed.data.leadId ?? null,
        payment_provider: "mercadopago",
        amount: course.price,
        currency: course.currency,
        status: "pending",
      })
      .select("id")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "No se pudo crear el pago" }, { status: 500 });
    }

    const baseUrl = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
    const preference = await createMercadoPagoPreference({
      title: course.title,
      quantity: 1,
      unitPrice: Number(course.price),
      currencyId: course.currency,
      payerEmail: user.email,
      externalReference: payment.id,
      notificationUrl: `${baseUrl}/api/payments/webhook`,
      successUrl: `${baseUrl}/checkout/success`,
      pendingUrl: `${baseUrl}/checkout/pending`,
      failureUrl: `${baseUrl}/checkout/failure`,
    });

    await supabase
      .from("payments")
      .update({
        provider_payment_id: preference.id,
      })
      .eq("id", payment.id);

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      enrollmentId,
      checkoutUrl: preference.initPoint ?? preference.sandboxInitPoint,
      checkoutUrlSandbox: preference.sandboxInitPoint,
    });
  } catch (error) {
    console.error("payments/create error", error);
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
