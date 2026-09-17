import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCustomerOrders } from "@/lib/account";
import { formatMoney } from "@/lib/format";
import SignOutButton from "@/components/SignOutButton";

export default async function AccountPage() {
  const t = await getTranslations("account");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-4 text-black/60">{t("notSignedIn")}</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-black px-6 py-2.5 text-white transition hover:bg-black/80"
        >
          {t("signInCta")}
        </Link>
      </div>
    );
  }

  const orders = await getCustomerOrders(user.id);

  const statusLabels: Record<string, string> = {
    pending: t("status.pending"),
    processing: t("status.processing"),
    shipped: t("status.shipped"),
    delivered: t("status.delivered"),
    cancelled: t("status.cancelled"),
    refunded: t("status.refunded"),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-sm text-black/50">{user.email}</p>
        </div>
        <SignOutButton />
      </div>

      <h2 className="mt-10 mb-4 text-xl font-medium">{t("ordersHeading")}</h2>

      {orders.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/20 p-6 text-center text-black/60">
          {t("noOrders")}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-md border border-black/10 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-black/50">
                <span>
                  {t("orderRef")}: {order.id.slice(0, 8).toUpperCase()}
                </span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-black/10 text-sm">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-black/60">
                      {formatMoney(item.unitPrice * item.qty, order.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-sm">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium capitalize">
                  {statusLabels[order.status] ?? order.status}
                </span>
                <span className="font-medium">
                  {formatMoney(order.total, order.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}