"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  disabled,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  disabled?: boolean;
}) {
  const t = useTranslations("shop");
  const tp = useTranslations("product");
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addItem({ productId, slug, name, price, imageUrl });
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 2000);
        }}
        className="w-full rounded-md bg-black px-6 py-3 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/30"
      >
        {disabled ? t("outOfStock") : t("addToCart")}
      </button>
      {justAdded && (
        <p className="text-sm text-green-700">{tp("addedToCart")}</p>
      )}
    </div>
  );
}
