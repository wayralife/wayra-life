import { Link } from "@/i18n/navigation";
import { getTrafficStats, getSalesStats } from "@/lib/admin/stats";
import { formatGBP } from "@/lib/format";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <p className="text-xs text-black/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AdminStatsPage() {
  const [traffic, sales] = await Promise.all([
    getTrafficStats(),
    getSalesStats(),
  ]);

  const maxDailyViews = Math.max(1, ...traffic.viewsLast30Days.map((d) => d.count));
  const maxTopPage = Math.max(1, ...traffic.topPages.map((p) => p.count));
  const maxTopProduct = Math.max(
    1,
    ...sales.topProducts.map((p) => p.unitsSold)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/admin" className="text-sm text-black/60 underline">
        ← Back to admin
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">Statistics</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Page views (all time)" value={String(traffic.totalViews)} />
        <StatTile
          label="Unique visitors (30d)"
          value={String(traffic.uniqueVisitors30d)}
        />
        <StatTile label="Total orders" value={String(sales.totalOrders)} />
        <StatTile
          label="Revenue (paid orders)"
          value={formatGBP(sales.totalRevenue)}
        />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-medium">Page views — last 30 days</h2>
        <div className="flex h-32 items-end gap-[3px] rounded-md border border-black/10 p-4">
          {traffic.viewsLast30Days.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.count} view${d.count === 1 ? "" : "s"}`}
              className="flex-1 rounded-t bg-black/80 transition hover:bg-black"
              style={{
                height: `${Math.max(2, (d.count / maxDailyViews) * 100)}%`,
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-black/40">
          <span>{traffic.viewsLast30Days[0]?.date}</span>
          <span>
            {traffic.viewsLast30Days[traffic.viewsLast30Days.length - 1]?.date}
          </span>
        </div>
      </section>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-medium">Top pages (30 days)</h2>
          {traffic.topPages.length === 0 ? (
            <p className="text-sm text-black/50">No visits recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {traffic.topPages.map((page) => (
                <li key={page.path} className="text-sm">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-black/70">{page.path}</span>
                    <span className="shrink-0 text-black/50">{page.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/5">
                    <div
                      className="h-1.5 rounded-full bg-black/80"
                      style={{
                        width: `${Math.max(4, (page.count / maxTopPage) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium">Best-selling products</h2>
          {sales.topProducts.length === 0 ? (
            <p className="text-sm text-black/50">No sales yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sales.topProducts.map((product) => (
                <li
                  key={product.productId ?? product.name}
                  className="text-sm"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-black/70">
                      {product.name}
                    </span>
                    <span className="shrink-0 text-black/50">
                      {product.unitsSold} sold · {formatGBP(product.revenue)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/5">
                    <div
                      className="h-1.5 rounded-full bg-black/80"
                      style={{
                        width: `${Math.max(4, (product.unitsSold / maxTopProduct) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-medium">Orders by status</h2>
        {sales.totalOrders === 0 ? (
          <p className="text-sm text-black/50">No orders yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(sales.ordersByStatus).map(([status, count]) => (
              <span
                key={status}
                className="rounded-full bg-black/5 px-3 py-1 text-sm"
              >
                {STATUS_LABELS[status] ?? status}: {count}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}