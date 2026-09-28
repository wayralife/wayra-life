"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { orderShippedEmail, orderRefundedEmail } from "@/lib/email-templates";

const VALID_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

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
 * Updates an order's status. On a transition to "shipped" or "refunded" we
 * also email the customer (best-effort — sendEmail never throws), using
 * their preferred locale when we have a linked profile, English otherwise.
 * Refunding additionally marks payment_status as refunded, since that's
 * what it means for a paid order.
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ ok: boolean; message?: string }> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { ok: false, message: "not_authorized" };
  }

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { ok: false, message: "invalid_status" };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, email, status, total, currency")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    return { ok: false, message: "not_found" };
  }

  const update: { status: string; payment_status?: string } = { status };
  if (status === "refunded") {
    update.payment_status = "refunded";
  }

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId);

  if (error) {
    return { ok: false, message: error.message };
  }

  if (status === "shipped" || status === "refunded") {
    let locale = "en";
    if (order.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("preferred_locale")
        .eq("id", order.user_id)
        .maybeSingle();
      if (profile?.preferred_locale) locale = profile.preferred_locale;
    }

    const { subject, html } =
      status === "shipped"
        ? orderShippedEmail(locale, order.id)
        : orderRefundedEmail(locale, order.id, Number(order.total), order.currency);

    await sendEmail({ to: order.email, subject, html });
  }

  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath("/[locale]/admin/orders/[id]", "page");
  revalidatePath("/[locale]/admin/stats", "page");
  revalidatePath("/[locale]/account", "page");

  return { ok: true };
}