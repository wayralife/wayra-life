import { createClient } from "@/lib/supabase/server";

export interface DailyViews {
  date: string;
  count: number;
}

export interface TopPage {
  path: string;
  count: number;
}

export interface TrafficStats {
  totalViews: number;
  uniqueVisitors30d: number;
  viewsLast30Days: DailyViews[];
  topPages: TopPage[];
}

export async function getTrafficStats(): Promise<TrafficStats> {
  const supabase = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();

  const [{ count: totalViews }, { data: recentRows }] = await Promise.all([
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase
      .from("page_views")
      .select("path, visitor_id, created_at")
      .gte("created_at", sinceIso),
  ]);

  const rows = recentRows ?? [];

  const uniqueVisitors30d = new Set(rows.map((r) => r.visitor_id)).size;

  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();
  for (const row of rows) {
    const day = row.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
    byPath.set(row.path, (byPath.get(row.path) ?? 0) + 1);
  }

  const viewsLast30Days: DailyViews[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    viewsLast30Days.push({ date: key, count: byDay.get(key) ?? 0 });
  }

  const topPages = Array.from(byPath.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalViews: totalViews ?? 0,
    uniqueVisitors30d,
    viewsLast30Days,
    topPages,
  };
}

export interface ProductSalesStat {
  productId: string | null;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  topProducts: ProductSalesStat[];
}

export async function getSalesStats(): Promise<SalesStats> {
  const supabase = await createClient();

  const [{ data: orders }, { data: items }] = await Promise.all([
    supabase.from("orders").select("id, status, total, payment_status"),
    supabase
      .from("order_items")
      .select("product_id, name_snapshot, qty, unit_price"),
  ]);

  const orderRows = orders ?? [];
  const totalOrders = orderRows.length;
  const totalRevenue = orderRows
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const ordersByStatus: Record<string, number> = {};
  for (const o of orderRows) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] ?? 0) + 1;
  }

  const byProduct = new Map<string, ProductSalesStat>();
  for (const item of items ?? []) {
    const key = item.product_id ?? item.name_snapshot;
    const revenue = Number(item.unit_price) * item.qty;
    const existing = byProduct.get(key);
    if (existing) {
      existing.unitsSold += item.qty;
      existing.revenue += revenue;
    } else {
      byProduct.set(key, {
        productId: item.product_id,
        name: item.name_snapshot,
        unitsSold: item.qty,
        revenue,
      });
    }
  }

  const topProducts = Array.from(byProduct.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 8);

  return { totalRevenue, totalOrders, ordersByStatus, topProducts };
}