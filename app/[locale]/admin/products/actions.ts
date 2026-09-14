"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface ProductFormState {
  status: "idle" | "success" | "error";
  message?: string;
  productId?: string;
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
    sku: String(formData.get("sku") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    sale_price: formData.get("sale_price")
      ? Number(formData.get("sale_price"))
      : null,
    on_sale: formData.get("on_sale") === "on",
    stock_qty: Number(formData.get("stock_qty") ?? 0),
    status: String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    category_id: String(formData.get("category_id") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  const core = readCoreFields(formData);
  if (!core.sku || !core.slug) {
    return { status: "error", message: "missing_fields" };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert(core)
    .select("id")
    .single();

  if (error || !product) {
    return { status: "error", message: error?.message ?? "insert_failed" };
  }

  const translationRows = routing.locales
    .map((locale) => ({
      product_id: product.id,
      locale,
      name: String(formData.get(`name_${locale}`) ?? "").trim(),
      description: String(formData.get(`description_${locale}`) ?? "").trim(),
    }))
    .filter((row) => row.name);

  if (translationRows.length > 0) {
    await supabase.from("product_translations").insert(translationRows);
  }

  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/shop", "page");
  return { status: "success", productId: product.id };
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { status: "error", message: "not_authorized" };
  }

  const core = readCoreFields(formData);
  if (!core.sku || !core.slug) {
    return { status: "error", message: "missing_fields" };
  }

  const { error } = await supabase
    .from("products")
    .update(core)
    .eq("id", productId);

  if (error) {
    return { status: "error", message: error.message };
  }

  for (const locale of routing.locales) {
    const name = String(formData.get(`name_${locale}`) ?? "").trim();
    const description = String(
      formData.get(`description_${locale}`) ?? ""
    ).trim();

    if (!name) continue;

    await supabase
      .from("product_translations")
      .upsert(
        { product_id: productId, locale, name, description },
        { onConflict: "product_id,locale" }
      );
  }

  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/admin/products/[id]", "page");
  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]/shop/[slug]", "page");
  return { status: "success", productId };
}

export async function addProductImage(
  productId: string,
  url: string,
  altText: string
) {
  const supabase = await requireAdmin();
  if (!url.trim()) return;

  const { data: existing } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSort = existing && existing[0] ? existing[0].sort_order + 1 : 0;

  await supabase.from("product_images").insert({
    product_id: productId,
    url: url.trim(),
    alt_text: altText.trim() || null,
    sort_order: nextSort,
  });

  revalidatePath("/[locale]/admin/products/[id]", "page");
  revalidatePath("/[locale]/shop/[slug]", "page");
}

export async function removeProductImage(imageId: string) {
  const supabase = await requireAdmin();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath("/[locale]/admin/products/[id]", "page");
  revalidatePath("/[locale]/shop/[slug]", "page");
}

export async function deleteProduct(productId: string) {
  const supabase = await requireAdmin();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/shop", "page");
}
