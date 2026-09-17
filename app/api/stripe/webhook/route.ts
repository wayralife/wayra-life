import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates";

// The Stripe SDK (and signature verification against the raw body) needs
// the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
    } catch (err) {
      console.error("Failed to handle checkout.session.completed", err);
      // Return 200 anyway would hide real errors from Stripe's retry
      // mechanism — return 500 so Stripe retries the webhook.
      return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  // Idempotency: Stripe may deliver the same event more than once.
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existing) return;
  }

  const cartSummary: Record<string, number> = session.metadata?.cart_items
    ? JSON.parse(session.metadata.cart_items)
    : {};
  const productIds = Object.keys(cartSummary);
  if (productIds.length === 0) return;

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, price, sale_price, on_sale, stock_qty")
    .in("id", productIds);

  const { data: translations } = await supabase
    .from("product_translations")
    .select("product_id, locale, name")
    .in("product_id", productIds);

  const email =
    session.customer_details?.email ?? session.customer_email ?? "unknown@example.com";
  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;
  const shippingCost = (session.total_details?.amount_shipping ?? 0) / 100;

  // If the buyer's email matches an existing customer account, link the
  // order to it so they can see it in their order history. Guest checkouts
  // (no matching account) simply get user_id = null.
  const { data: matchingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: matchingProfile?.id ?? null,
      email,
      status: "processing",
      payment_status: "paid",
      subtotal,
      shipping: shippingCost,
      total,
      currency: (session.currency ?? "gbp").toUpperCase(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw orderError ?? new Error("Order insert returned no row");
  }

  const orderItems = productIds.map((productId) => {
    const product = products?.find((p) => p.id === productId);
    const translation =
      translations?.find(
        (t) => t.product_id === productId && t.locale === "en"
      ) ?? translations?.find((t) => t.product_id === productId);
    const unitPrice = product
      ? product.on_sale && product.sale_price != null
        ? Number(product.sale_price)
        : Number(product.price)
      : 0;

    return {
      order_id: order.id,
      product_id: productId,
      qty: cartSummary[productId],
      unit_price: unitPrice,
      name_snapshot: translation?.name ?? product?.slug ?? "Unknown product",
    };
  });

  await supabase.from("order_items").insert(orderItems);

  // Best-effort order confirmation email — never blocks order creation
  // if it fails (see lib/email.ts).
  const locale = session.metadata?.locale ?? "en";
  const { subject, html } = orderConfirmationEmail(locale, {
    orderId: order.id,
    items: orderItems.map((item) => ({
      name: item.name_snapshot,
      qty: item.qty,
      unitPrice: Number(item.unit_price),
    })),
    subtotal,
    shipping: shippingCost,
    total,
    currency: (session.currency ?? "gbp").toUpperCase(),
  });
  await sendEmail({ to: email, subject, html });

  await supabase.from("payments").insert({
    order_id: order.id,
    stripe_payment_intent_id: paymentIntentId,
    amount: total,
    status: "succeeded",
  });

  for (const productId of productIds) {
    const product = products?.find((p) => p.id === productId);
    if (!product) continue;
    const newStock = Math.max(0, product.stock_qty - cartSummary[productId]);
    await supabase
      .from("products")
      .update({ stock_qty: newStock })
      .eq("id", productId);
  }
}