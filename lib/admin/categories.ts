import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export interface AdminCategoryListItem {
  id: string;
  slug: string;
  sort_order: number;
  visible: boolean;
  name: string;
  productCount: number;
}

export async function getAdminCategories(): Promise<AdminCategoryListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, sort_order, visible, category_translations(locale, name), products(count)"
    )
    .order("sort_order");

  if (error || !data) return [];

  return data.map((row: any) => {
    const translations: any[] = row.category_translations ?? [];
    const translation =
      translations.find((t) => t.locale === "en") ?? translations[0];
    return {
      id: row.id,
      slug: row.slug,
      sort_order: row.sort_order,
      visible: row.visible,
      name: translation?.name ?? row.slug,
      productCount: row.products?.[0]?.count ?? 0,
    };
  });
}

export interface AdminCategoryDetail {
  id: string;
  slug: string;
  sort_order: number;
  visible: boolean;
  image_url: string | null;
  translations: Record<string, { name: string; description: string }>;
}

export async function getAdminCategory(
  id: string
): Promise<AdminCategoryDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, sort_order, visible, image_url, category_translations(locale, name, description)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const row: any = data;
  const translations: Record<string, { name: string; description: string }> =
    {};
  for (const locale of routing.locales) {
    const t = (row.category_translations ?? []).find(
      (tr: any) => tr.locale === locale
    );
    translations[locale] = {
      name: t?.name ?? "",
      description: t?.description ?? "",
    };
  }

  return {
    id: row.id,
    slug: row.slug,
    sort_order: row.sort_order,
    visible: row.visible,
    image_url: row.image_url,
    translations,
  };
}
