import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface AdminProductListItem {
  id: string;
  sku: string;
  slug: string;
  price: number;
  stock_qty: number;
  status: string;
  sort_order: number;
  name: string;
}

export async function getAdminProducts(): Promise<AdminProductListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, sku, slug, price, stock_qty, status, sort_order, product_translations(locale, name)"
    )
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => {
    const translations: any[] = row.product_translations ?? [];
    const translation =
      translations.find((t) => t.locale === "en") ?? translations[0];
    return {
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      price: Number(row.price),
      stock_qty: row.stock_qty,
      status: row.status,
      sort_order: row.sort_order,
      name: translation?.name ?? row.slug,
    };
  });
}

export interface AdminCategoryOption {
  id: string;
  name: string;
}

export async function getAdminCategoryOptions(): Promise<AdminCategoryOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, sort_order, category_translations(locale, name)")
    .order("sort_order");

  if (error || !data) return [];

  return data.map((row: any) => {
    const translations: any[] = row.category_translations ?? [];
    const translation =
      translations.find((t) => t.locale === "en") ?? translations[0];
    return { id: row.id, name: translation?.name ?? row.id };
  });
}

export interface AdminProductDetail {
  id: string;
  sku: string;
  slug: string;
  price: number;
  sale_price: number | null;
  on_sale: boolean;
  stock_qty: number;
  status: string;
  featured: boolean;
  category_id: string | null;
  sort_order: number;
  translations: Record<string, { name: string; description: string }>;
  images: { id: string; url: string; alt_text: string; sort_order: number }[];
}

export async function getAdminProduct(
  id: string
): Promise<AdminProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, sku, slug, price, sale_price, on_sale, stock_qty, status, featured, category_id, sort_order, product_translations(locale, name, description), product_images(id, url, alt_text, sort_order)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row: any = data;
  const translations: Record<string, { name: string; description: string }> =
    {};
  for (const locale of routing.locales) {
    const t = (row.product_translations ?? []).find(
      (tr: any) => tr.locale === locale
    );
    translations[locale] = {
      name: t?.name ?? "",
      description: t?.description ?? "",
    };
  }

  const images = [...(row.product_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    price: Number(row.price),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
    on_sale: row.on_sale,
    stock_qty: row.stock_qty,
    status: row.status,
    featured: row.featured,
    category_id: row.category_id,
    sort_order: row.sort_order,
    translations,
    images: images.map((img: any) => ({
      id: img.id,
      url: img.url,
      alt_text: img.alt_text ?? "",
      sort_order: img.sort_order,
    })),
  };
}
