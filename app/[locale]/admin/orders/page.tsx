import { Link } from "@/i18n/navigation";
import { getAdminOrders } from "@/lib/admin/orders";
import { formatMoney } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/admin" className="text-sm text-black/60 underline">
        ← Back to admin
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-black/50">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase text-black/50">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-black/10 hover:bg-black/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium underline"
                    >
                      {order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-black/70">{order.email}</td>
                  <td className="px-4 py-3 text-black/70">{order.itemCount}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/70">{order.paymentStatus}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatMoney(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}