"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface CategoryFormState {
  status: "idle" | "success" | "error";
  message?: string;
  categoryId?: string;
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

function readCoreFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    visible: formData.get("visible") === "on",
    image_url: String(formData.get("image_url") ?? "").trim() || null,
  };
}

function revalidateAll() {
  revalidatePath("/[locale]/admin/categories", "page");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/shop", "page");
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  const core = readCoreFields(formData);
  if (!core.slug) return { status: "error", message: "missing_fields" };

  const { data: category, error } = await supabase
    .from("categories")
    .insert(core)
    .select("id")
    .single();

  if (error || !category) {
    return { status: "error", message: error?.message ?? "insert_failed" };
  }

  const translationRows = routing.locales
    .map((locale) => ({
      category_id: category.id,
      locale,
      name: String(formData.get(`name_${locale}`) ?? "").trim(),
      description: String(formData.get(`description_${locale}`) ?? "").trim(),
    }))
    .filter((row) => row.name);

  if (translationRows.length > 0) {
    await supabase.from("category_translations").insert(translationRows);
  }

  revalidateAll();
  return { status: "success", categoryId: category.id };
}

export async function updateCategory(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  const core = readCoreFields(formData);
  if (!core.slug) return { status: "error", message: "missing_fields" };

  const { error } = await supabase
    .from("categories")
    .update(core)
    .eq("id", categoryId);

  if (error) return { status: "error", message: error.message };

  for (const locale of routing.locales) {
    const name = String(formData.get(`name_${locale}`) ?? "").trim();
    const description = String(
      formData.get(`description_${locale}`) ?? ""
    ).trim();
    if (!name) continue;

    await supabase
      .from("category_translations")
      .upsert(
        { category_id: categoryId, locale, name, description },
        { onConflict: "category_id,locale" }
      );
  }

  revalidateAll();
  revalidatePath("/[locale]/shop/[slug]", "page");
  return { status: "success", categoryId };
}

export async function deleteCategory(categoryId: string) {
  const supabase = await requireAdmin();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidateAll();
}
