"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteProduct } from "@/app/[locale]/admin/products/actions";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Usunąć produkt "${productName}"? Tego nie da się cofnąć.`)) {
          return;
        }
        startTransition(async () => {
          await deleteProduct(productId);
          router.refresh();
        });
      }}
      className="text-sm text-red-600 underline disabled:opacity-40"
    >
      {isPending ? "Usuwanie…" : "Usuń"}
    </button>
  );
}
