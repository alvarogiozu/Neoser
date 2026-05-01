import { createBrowserClient } from "@supabase/ssr";
import { assertSupabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = assertSupabasePublicEnv();

  return createBrowserClient(
    url,
    anonKey,
  );
}
