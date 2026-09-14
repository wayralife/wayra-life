import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAdminCategory } from "@/lib/admin/categories";
import { updateCategory } from "../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);

  if (!category) {
    notFound();
  }

  const boundUpdate = updateCategory.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin/categories"
        className="text-sm text-black/60 underline"
      >
        ← Wróć do listy kategorii
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">
        Edycja: {category.translations.en?.name || category.slug}
      </h1>

      <CategoryForm action={boundUpdate} category={category} />
    </div>
  );
}
