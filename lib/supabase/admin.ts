import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only "admin" client using the Supabase service role key — it
 * bypasses Row Level Security entirely. Never import this from a "use
 * client" component, and only use it for trusted server-to-server work
 * (e.g. the Stripe webhook writing an order after a verified payment),
 * never for a request driven directly by user input.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}