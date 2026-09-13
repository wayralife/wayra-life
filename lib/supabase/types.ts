// Minimal hand-written types for the tables the storefront reads.
// A full generated schema (via `mcp__Supabase__generate_typescript_types`)
// can replace this file later without changing call sites.

export type ProductStatus = "draft" | "active" | "archived";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          slug: string;
          sort_order: number;
          visible: boolean;
          image_url: string | null;
          created_at: string;
        };
      };
      category_translations: {
        Row: {
          category_id: string;
          locale: string;
          name: string;
          description: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          slug: string;
          price: string;
          sale_price: string | null;
          cost_price: string | null;
          stock_qty: number;
          low_stock_threshold: number;
          category_id: string | null;
          status: ProductStatus;
          featured: boolean;
          on_sale: boolean;
          weight_grams: number | null;
          dimensions_cm: string | null;
          country_of_origin: string | null;
          materials: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      product_translations: {
        Row: {
          product_id: string;
          locale: string;
          name: string;
          description: string | null;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
        };
      };
    };
  };
}
