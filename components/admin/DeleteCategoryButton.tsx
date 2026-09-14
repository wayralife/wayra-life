"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteCategory } from "@/app/[locale]/admin/categories/actions";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          !confirm(
            `Usunąć kategorię "${categoryName}"? Produkty w niej pozostaną, ale stracą przypisaną kategorię.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          await deleteCategory(categoryId);
          router.refresh();
        });
      }}
      className="text-sm text-red-600 underline disabled:opacity-40"
    >
      {isPending ? "Usuwanie…" : "Usuń"}
    </button>
  );
}
