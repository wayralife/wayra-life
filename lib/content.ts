import { createClient } from "@/lib/supabase/server";

/**
 * Reads one admin-editable content block for the given locale. Returns
 * null if it hasn't been set up in the database yet — callers should
 * fall back to a sensible default (e.g. the static next-intl string)
 * rather than showing a blank page.
 */
export async function getContentBlock<T = Record<string, string>>(
  key: string,
  locale: string
): Promise<T | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_blocks")
    .select("body_json")
    .eq("key", key)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data || !data.body_json) return null;
  return data.body_json as T;
}
