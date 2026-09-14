import { Link } from "@/i18n/navigation";
import { getAdminContentBlock } from "@/lib/admin/content";
import { saveContentBlock } from "../actions";
import ContentBlockForm, {
  type ContentFieldConfig,
} from "@/components/admin/ContentBlockForm";

const FIELDS: ContentFieldConfig[] = [
  { name: "heroTitle", label: "Tytuł (duży nagłówek)", type: "text" },
  { name: "heroSubtitle", label: "Podtytuł", type: "textarea" },
  { name: "heroImageUrl", label: "Zdjęcie w tle (URL, opcjonalnie)", type: "url" },
  { name: "ctaLabel", label: "Tekst przycisku", type: "text" },
  { name: "ctaUrl", label: "Link przycisku (np. /shop)", type: "text" },
];

export default async function AdminHomeContentPage() {
  const initialData = await getAdminContentBlock("home_hero");
  const boundSave = saveContentBlock.bind(
    null,
    "home_hero",
    FIELDS.map((f) => f.name)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin" className="text-sm text-black/60 underline">
        ← Wróć do panelu
      </Link>

      <h1 className="mt-4 mb-2 text-3xl font-semibold">
        Strona główna — treść
      </h1>
      <p className="mb-8 text-sm text-black/50">
        Zmiany widoczne będą od razu po zapisaniu na wayra-life.vercel.app.
        Puste pole = użyty zostanie domyślny tekst.
      </p>

      <ContentBlockForm
        action={boundSave}
        fields={FIELDS}
        initialData={initialData}
      />
    </div>
  );
}
