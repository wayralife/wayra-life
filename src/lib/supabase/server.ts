import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Supabase client for use in Server Components, Server Actions and Route
 * Handlers. Reads/writes the auth session via cookies. Still uses the public
 * anon/publishable key — RLS policies (see the database migrations) enforce
 * access control, not this client.
 *
 * For privileged server-only operations (webhooks, admin scripts) a separate
 * service-role client should be created with SUPABASE_SERVICE_ROLE_KEY and
 * must never be imported into any file that can run in the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component without a mutable cookie jar
            // (e.g. during static rendering). Safe to ignore as long as a
            // Server Action or Route Handler refreshes the session cookie.
          }
        },
      },
    },
  );
}
