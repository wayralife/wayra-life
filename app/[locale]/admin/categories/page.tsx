import { Link } from "@/i18n/navigation";
import { getAdminCategories } from "@/lib/admin/categories";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Kategorie</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-black px-5 py-2.5 text-white transition hover:bg-black/80"
        >
          + Nowa kategoria
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-black/60">Brak kategorii.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-black/50">
                <th className="py-2 pr-4">Kolejność</th>
                <th className="py-2 pr-4">Nazwa</th>
                <th className="py-2 pr-4">Produkty</th>
                <th className="py-2 pr-4">Widoczna</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-black/5">
                  <td className="py-3 pr-4 text-black/60">{c.sort_order}</td>
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4">{c.productCount}</td>
                  <td className="py-3 pr-4">
                    {c.visible ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        tak
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60">
                        nie
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="text-sm underline"
                      >
                        Edytuj
                      </Link>
                      <DeleteCategoryButton
                        categoryId={c.id}
                        categoryName={c.name}
                      />
                    </div>
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
