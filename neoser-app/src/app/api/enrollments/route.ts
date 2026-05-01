import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enrollmentSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = enrollmentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { error } = await supabase.from("enrollments").insert({
    course_id: parsed.data.courseId,
    user_id: user.id,
    notes: parsed.data.notes ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo registrar la matricula" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
