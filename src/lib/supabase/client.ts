"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Supabase client for use in Client Components ("use client").
 * Uses the public anon/publishable key only — safe to expose in the browser.
 * Row Level Security (see the database migrations) controls what this
 * client is actually allowed to read or write.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
