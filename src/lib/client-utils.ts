"use client";

import { env } from "@/env.mjs";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./schema";

export const createBrowserSupabaseClient = () => {
  // Injects type dependencies from database schema (<Database>)
  const supabaseClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabaseClient;
};
