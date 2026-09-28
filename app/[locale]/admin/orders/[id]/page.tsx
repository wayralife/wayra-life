import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAdminOrder, type AdminOrderAddress } from "@/lib/admin/orders";
import { formatMoney } from "@/lib/format";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: AdminOrderAddress | null;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-black/50">{title}</h3>
      {!address ? (
        <p className="text-sm text-black/40">Not provided.</p>
      ) : (
        <p className="text-sm text-black/70">
          {address.fullName && (
            <>
              {address.fullName}
              <br />
            </>
          )}
          {address.line1}
          <br />
          {address.line2 && (
            <>
              {address.line2}
              <br />
            </>
          )}
          {address.city}
          {address.region ? `, ${address.region}` : ""} {address.postcode}
          <br />
          {address.country}
          {address.phone && (
            <>
              <br />
              {address.phone}
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/admin/orders" className="text-sm text-black/60 underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-semibold">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <span className="text-sm text-black/50">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-black/60">{order.email}</p>

      <div className="mt-6 rounded-md border border-black/10 p-4">
        <h2 className="mb-3 text-sm font-medium text-black/50">Status</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        <p className="mt-2 text-xs text-black/40">
          Payment status: {order.paymentStatus}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-medium">Items</h2>
        <table className="w-full text-left text-sm">
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-black/10">
                <td className="py-2 text-black/70">
                  {item.name} × {item.qty}
                </td>
                <td className="py-2 text-right text-black/70">
                  {formatMoney(item.unitPrice * item.qty, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto max-w-xs text-sm">
          <div className="flex justify-between py-1">
            <span className="text-black/50">Subtotal</span>
            <span>{formatMoney(order.subtotal, order.currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-black/50">Discount</span>
              <span>-{formatMoney(order.discount, order.currency)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-black/50">Shipping</span>
            <span>{formatMoney(order.shipping, order.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-black/10 py-1 pt-2 font-semibold">
            <span>Total</span>
            <span>{formatMoney(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <AddressBlock title="Shipping address" address={order.shippingAddress} />
        <AddressBlock title="Billing address" address={order.billingAddress} />
      </div>
    </div>
  );
}