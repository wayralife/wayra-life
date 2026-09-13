"use client";

import { useState, useTransition } from "react";
import {
  addProductImage,
  removeProductImage,
} from "@/app/[locale]/admin/products/actions";

interface ImageRow {
  id: string;
  url: string;
  alt_text: string;
}

export default function ProductImages({
  productId,
  images,
}: {
  productId: string;
  images: ImageRow[];
}) {
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Zdjęcia</h2>

      <p className="text-sm text-black/50">
        Wklej bezpośredni link (URL) do zdjęcia — np. z Supabase Storage albo
        innego miejsca w internecie, gdzie masz je wgrane. Wgrywanie plików
        bezpośrednio z komputera to funkcja na przyszłość.
      </p>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-md bg-black/5">
                {/* Plain img, not next/image: admin may paste a URL from any
                    host, and next/image requires each host to be
                    allow-listed in next.config.ts ahead of time. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt_text || "product"}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await removeProductImage(img.id);
                  })
                }
                className="text-xs text-red-600 underline"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border border-black/20 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Opis zdjęcia (alt text, opcjonalnie)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="flex-1 rounded-md border border-black/20 px-3 py-2"
        />
        <button
          type="button"
          disabled={isPending || !url.trim()}
          onClick={() =>
            startTransition(async () => {
              await addProductImage(productId, url, altText);
              setUrl("");
              setAltText("");
            })
          }
          className="rounded-md border border-black/20 px-4 py-2 text-sm transition hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Dodaj zdjęcie
        </button>
      </div>
    </section>
  );
}