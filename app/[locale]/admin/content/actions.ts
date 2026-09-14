"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface ContentFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export interface ContentBlockFieldSpec {
  name: string;
  /** Shared fields (images) are submitted once, without a locale suffix,
   * and copied into every locale's JSON. Everything else is submitted as
   * `${name}_${locale}` and stored per-locale. */
  shared?: boolean;
}

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
  return supabase;
}

/**
 * Generic save for a content block. `fields` lists every field used by
 * this block (they differ between the homepage hero and Our Story, for
 * example) — shared fields (images) come from a single form input,
 * everything else is read per-locale as `${field}_${locale}`.
 */
export async function saveContentBlock(
  key: string,
  fields: ContentBlockFieldSpec[],
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  const sharedValues: Record<string, string> = {};
  for (const field of fields) {
    if (field.shared) {
      sharedValues[field.name] = String(formData.get(field.name) ?? "");
    }
  }

  for (const locale of routing.locales) {
    const body_json: Record<string, string> = { ...sharedValues };
    for (const field of fields) {
      if (field.shared) continue;
      body_json[field.name] = String(
        formData.get(`${field.name}_${locale}`) ?? ""
      );
    }

    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key, locale, body_json }, { onConflict: "key,locale" });

    if (error) {
      return { status: "error", message: error.message };
    }
  }

  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/our-story", "page");
  return { status: "success" };
}
