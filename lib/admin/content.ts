import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

/**
 * Reads one content block across all three locales, for the admin edit
 * form. Locales that don't have a row yet come back as an empty object
 * so the form still renders (with blank fields for that locale).
 */
export async function getAdminContentBlock(
  key: string
): Promise<Record<string, Record<string, string>>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_blocks")
    .select("locale, body_json")
    .eq("key", key);

  const result: Record<string, Record<string, string>> = {};
  for (const locale of routing.locales) {
    const row = data?.find((r) => r.locale === locale);
    result[locale] = (row?.body_json as Record<string, string>) ?? {};
  }
  return result;
}
