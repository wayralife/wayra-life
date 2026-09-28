import { createClient } from "@/lib/supabase/server";

export interface AdminOrderListItem {
  id: string;
  email: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  itemCount: number;
}

export async function getAdminOrders(): Promise<AdminOrderListItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select(
      "id, email, status, payment_status, total, currency, created_at, order_items(id)"
    )
    .order("created_at", { ascending: false })
    .returns
      {
        id: string;
        email: string;
        status: string;
        payment_status: string;
        total: number;
        currency: string;
        created_at: string;
        order_items: { id: string }[];
      }[]
    >();

  return (data ?? []).map((order) => ({
    id: order.id,
    email: order.email,
    status: order.status,
    paymentStatus: order.payment_status,
    total: Number(order.total),
    currency: order.currency,
    createdAt: order.created_at,
    itemCount: order.order_items?.length ?? 0,
  }));
}

export interface AdminOrderItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface AdminOrderAddress {
  fullName: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postcode: string;
  country: string;
  phone: string | null;
}

export interface AdminOrderDetail {
  id: string;
  userId: string | null;
  email: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  items: AdminOrderItem[];
  shippingAddress: AdminOrderAddress | null;
  billingAddress: AdminOrderAddress | null;
}

function mapAddress(row: {
  full_name: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postcode: string;
  country: string;
  phone: string | null;
} | null): AdminOrderAddress | null {
  if (!row) return null;
  return {
    fullName: row.full_name,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    region: row.region,
    postcode: row.postcode,
    country: row.country,
    phone: row.phone,
  };
}

export async function getAdminOrder(
  orderId: string
): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      `id, user_id, email, status, payment_status, subtotal, discount, shipping, total, currency, created_at,
       order_items(id, name_snapshot, qty, unit_price),
       shipping_address:shipping_address_id(full_name, line1, line2, city, region, postcode, country, phone),
       billing_address:billing_address_id(full_name, line1, line2, city, region, postcode, country, phone)`
    )
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return null;

  const row = order as unknown as {
    id: string;
    user_id: string | null;
    email: string;
    status: string;
    payment_status: string;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    currency: string;
    created_at: string;
    order_items: { id: string; name_snapshot: string; qty: number; unit_price: number }[];
    shipping_address: AdminOrderAddress extends never ? never : Parameters<typeof mapAddress>[0];
    billing_address: Parameters<typeof mapAddress>[0];
  };

  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    status: row.status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    currency: row.currency,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      name: item.name_snapshot,
      qty: item.qty,
      unitPrice: Number(item.unit_price),
    })),
    shippingAddress: mapAddress(row.shipping_address),
    billingAddress: mapAddress(row.billing_address),
  };
}