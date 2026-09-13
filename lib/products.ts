import { createClient } from "@/lib/supabase/server";

export interface ShopProduct {
  id: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  stockQty: number;
  categoryId: string | null;
  categorySlug: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
}

/**
 * Loads active products (optionally filtered by category slug), joined with
 * their translation for the current locale (falling back to English) and
 * their first image.
 */
export async function getShopProducts(
  locale: string,
  categorySlug?: string
): Promise<ShopProduct[]> {
  const supabase = await createClient();

  let categoryId: string | undefined;
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (!category) return [];
    categoryId = category.id;
  }

  let query = supabase
    .from("products")
    .select(
      "id, slug, sku, price, sale_price, on_sale, stock_qty, category_id, categories(slug), product_translations(locale, name, description), product_images(url, alt_text, sort_order)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row: any) => {
    const translations: any[] = row.product_translations ?? [];
    const translation =
      translations.find((t) => t.locale === locale) ??
      translations.find((t) => t.locale === "en") ??
      translations[0];

    const images: any[] = [...(row.product_images ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
    const firstImage = images[0];

    return {
      id: row.id,
      slug: row.slug,
      sku: row.sku,
      price: Number(row.price),
      salePrice: row.sale_price ? Number(row.sale_price) : null,
      onSale: row.on_sale,
      stockQty: row.stock_qty,
      categoryId: row.category_id,
      categorySlug: row.categories?.slug ?? null,
      name: translation?.name ?? row.slug,
      description: translation?.description ?? null,
      imageUrl: firstImage?.url ?? null,
      imageAlt: firstImage?.alt_text ?? null,
    };
  });
}

export async function getShopProductBySlug(
  locale: string,
  slug: string
): Promise<ShopProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, sku, price, sale_price, on_sale, stock_qty, category_id, categories(slug), product_translations(locale, name, description), product_images(url, alt_text, sort_order)"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;

  const row: any = data;
  const translations: any[] = row.product_translations ?? [];
  const translation =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === "en") ??
    translations[0];

  const images: any[] = [...(row.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : null,
    onSale: row.on_sale,
    stockQty: row.stock_qty,
    categoryId: row.category_id,
    categorySlug: row.categories?.slug ?? null,
    name: translation?.name ?? row.slug,
    description: translation?.description ?? null,
    imageUrl: images[0]?.url ?? null,
    imageAlt: images[0]?.alt_text ?? null,
  };
}

export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
}

export async function getShopCategories(locale: string): Promise<ShopCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, sort_order, category_translations(locale, name)")
    .eq("visible", true)
    .order("sort_order");

  if (error || !data) return [];

  return data.map((row: any) => {
    const translations: any[] = row.category_translations ?? [];
    const translation =
      translations.find((t) => t.locale === locale) ??
      translations.find((t) => t.locale === "en") ??
      translations[0];
    return { id: row.id, slug: row.slug, name: translation?.name ?? row.slug };
  });
}
