import { Link } from "@/i18n/navigation";
import { createCategory } from "../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin/categories"
        className="text-sm text-black/60 underline"
      >
        ← Wróć do listy kategorii
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">Nowa kategoria</h1>

      <CategoryForm action={createCategory} />
    </div>
  );
}
