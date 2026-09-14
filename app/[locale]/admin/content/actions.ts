"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface ContentFormState {
  status: "idle" | "success" | "error";
  message?: string;
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
 * Generic save for a content block: for each locale, reads
 * `${field}_${locale}` out of the form and upserts one row of JSON.
 * `fields` lists the field names used for THIS block (they differ
 * between the homepage hero and Our Story, for example).
 */
export async function saveContentBlock(
  key: string,
  fields: string[],
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  for (const locale of routing.locales) {
    const body_json: Record<string, string> = {};
    for (const field of fields) {
      body_json[field] = String(formData.get(`${field}_${locale}`) ?? "");
    }

    const { error } = await supabase
      .from("content_blocks")
      .upsert(
        { key, locale, body_json },
        { onConflict: "key,locale" }
      );

    if (error) {
      return { status: "error", message: error.message };
    }
  }

  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/our-story", "page");
  return { status: "success" };
}
