function getFirstDefined(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value;
  }
  return "";
}

export function getSupabaseUrl() {
  return getFirstDefined(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]);
}

export function getSupabaseAnonKey() {
  return getFirstDefined(["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"]);
}

export function getSupabaseServiceRoleKey() {
  return getFirstDefined(["SUPABASE_SERVICE_ROLE_KEY"]);
}

export function assertSupabasePublicEnv() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return { url, anonKey };
}
