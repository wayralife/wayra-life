import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Note: not using the generic Database type parameter here — see the
// comment in lib/supabase/client.ts for why.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without a mutable cookie store.
            // Safe to ignore when middleware handles session refresh.
          }
        },
      },
    }
  );
}
