import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id,title,description,price,currency,mode,is_published")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "No se pudieron cargar los cursos" }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
