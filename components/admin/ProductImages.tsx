"use client";

import { useState, useTransition } from "react";
import {
  addProductImage,
  removeProductImage,
} from "@/app/[locale]/admin/products/actions";
import { createClient } from "@/lib/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: false });
      if (error) throw error;

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      startTransition(async () => {
        await addProductImage(productId, data.publicUrl, altText);
        setAltText("");
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Błąd wgrywania");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Zdjęcia</h2>

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

      <div className="flex flex-col gap-3 rounded-md border border-black/10 p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Opis zdjęcia (alt text, opcjonalnie) — zastosuje się do kolejnego
            dodanego zdjęcia
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={isUploading || isPending}
            className="text-sm"
          />
          {isUploading && (
            <span className="text-xs text-black/50">Wgrywanie…</span>
          )}
        </div>
        {uploadError && (
          <p className="text-xs text-red-600">{uploadError}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            placeholder="...albo wklej link do zdjęcia ręcznie"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
            Dodaj z linku
          </button>
        </div>
      </div>
    </section>
  );
}
