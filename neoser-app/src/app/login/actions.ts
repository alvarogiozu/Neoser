"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function login(formData: FormData) {
  const { email, password } = getCredentials(formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent("No se pudo iniciar sesion")}`);
  }

  redirect("/admin");
}

export async function signup(formData: FormData) {
  const { email, password } = getCredentials(formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent("No se pudo crear la cuenta")}`);
  }

  redirect("/login?message=Revisa+tu+email+para+confirmar");
}
