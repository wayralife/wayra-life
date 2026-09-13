import { createBrowserClient } from "@supabase/ssr";

// Note: not using the generic Database type parameter here — our
// hand-written types.ts is a partial reference schema, not a full
// generated one, and typing joined/aliased select() queries against a
// partial schema fights the Supabase client's generics more than it
// helps. Swap in `mcp__Supabase__generate_typescript_types` output and
// re-add `<Database>` here for full type safety later.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
