"use server";

import { createClient } from "@/lib/supabase/server";
import { translateFields, type TranslationResult } from "@/lib/translate";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("not_admin");
}

export async function translateFromEnglish(
  sourceTexts: Record<string, string>
): Promise<TranslationResult> {
  await requireAdmin();
  return translateFields(sourceTexts);
}
