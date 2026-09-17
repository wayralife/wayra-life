import { createClient } from "@/lib/supabase/server";

export interface CustomerOrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface CustomerOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  items: CustomerOrderItem[];
}

interface OrderItemRow {
  id: string;
  name_snapshot: string;
  qty: number;
  unit_price: number;
}

interface OrderRow {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  currency: string;
  created_at: string;
  order_items: OrderItemRow[];
}

/**
 * Order history for the signed-in customer. Relies on RLS
 * (orders_select_own_or_admin: auth.uid() = user_id) so this only ever
 * returns orders belonging to the current user — no need to filter again
 * here, but we still scope the query by userId for clarity and to avoid
 * an accidental full-table fetch if RLS is ever misconfigured.
 */
export async function getCustomerOrders(
  userId: string
): Promise<CustomerOrder[]> {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, status, payment_status, total, currency, created_at, order_items(id, name_snapshot, qty, unit_price)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<OrderRow[]>();

  return (orders ?? []).map((order) => ({
    id: order.id,
    status: order.status,
    paymentStatus: order.payment_status,
    total: Number(order.total),
    currency: order.currency,
    createdAt: order.created_at,
    items: (order.order_items ?? []).map((item) => ({
      id: item.id,
      name: item.name_snapshot,
      qty: item.qty,
      unitPrice: Number(item.unit_price),
    })),
  }));
}
