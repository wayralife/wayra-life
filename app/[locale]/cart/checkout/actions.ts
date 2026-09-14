"use server";

import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export interface CheckoutCartItem {
  productId: string;
  quantity: number;
}

export interface CheckoutResult {
  url?: string;
  error?: string;
}

/**
 * Creates a Stripe Checkout Session for the given cart. Prices are never
 * trusted from the client — every line item's price comes fresh from the
 * `products` table. The cart contents are stashed in the session's
 * metadata so the webhook can rebuild the order after payment succeeds.
 */
export async function createCheckoutSession(
  items: CheckoutCartItem[],
  locale: string
): Promise<CheckoutResult> {
  if (!items || items.length === 0) {
    return { error: "empty_cart" };
  }

  const supabase = await createClient();
  const ids = items.map((i) => i.productId);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, price, sale_price, on_sale, stock_qty, status")
    .in("id", ids);

  if (error || !products || products.length === 0) {
    return { error: "products_not_found" };
  }

  const { data: translations } = await supabase
    .from("product_translations")
    .select("product_id, locale, name")
    .in("product_id", ids);

  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    `https://${headersList.get("host")}`;

  const line_items: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; metadata: { product_id: string } };
      unit_amount: number;
    };
    quantity: number;
  }> = [];

  const cartSummary: Record<string, number> = {};

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.status !== "active") continue;
    if (item.quantity < 1) continue;

    const quantity = Math.min(item.quantity, product.stock_qty);
    if (quantity < 1) continue;

    const unitPrice =
      product.on_sale && product.sale_price != null
        ? Number(product.sale_price)
        : Number(product.price);

    const translation =
      translations?.find(
        (t) => t.product_id === product.id && t.locale === "en"
      ) ?? translations?.find((t) => t.product_id === product.id);

    line_items.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: translation?.name ?? product.slug,
          metadata: { product_id: product.id },
        },
        unit_amount: Math.round(unitPrice * 100),
      },
      quantity,
    });

    cartSummary[product.id] = quantity;
  }

  if (line_items.length === 0) {
    return { error: "empty_cart" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    shipping_address_collection: { allowed_countries: ["GB"] },
    metadata: {
      cart_items: JSON.stringify(cartSummary),
      locale,
    },
  });

  if (!session.url) {
    return { error: "stripe_error" };
  }

  return { url: session.url };
}
