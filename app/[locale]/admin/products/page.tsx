import { Link } from "@/i18n/navigation";
import { getAdminProducts } from "@/lib/admin/products";
import { formatGBP } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Produkty</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-black px-5 py-2.5 text-white transition hover:bg-black/80"
        >
          + Nowy produkt
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-black/60">Brak produktów.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-black/50">
                <th className="py-2 pr-4">Nazwa</th>
                <th className="py-2 pr-4">SKU</th>
                <th className="py-2 pr-4">Cena</th>
                <th className="py-2 pr-4">Magazyn</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-black/5">
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4 text-black/60">{p.sku}</td>
                  <td className="py-3 pr-4">{formatGBP(p.price)}</td>
                  <td className="py-3 pr-4">{p.stock_qty}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        p.status === "active"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
                          : "rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm underline"
                    >
                      Edytuj
                    </Link>
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