import { Link } from "@/i18n/navigation";
import { getAdminContentBlock } from "@/lib/admin/content";
import { saveContentBlock } from "../actions";
import ContentBlockForm, {
  type ContentFieldConfig,
} from "@/components/admin/ContentBlockForm";

const FIELDS: ContentFieldConfig[] = [
  { name: "title", label: "Tytuł strony", type: "text" },
  { name: "body", label: "Treść (każdy akapit w nowej linii)", type: "textarea" },
  { name: "imageUrl", label: "Zdjęcie (URL, opcjonalnie)", type: "url" },
];

export default async function AdminOurStoryContentPage() {
  const initialData = await getAdminContentBlock("our_story");
  const boundSave = saveContentBlock.bind(
    null,
    "our_story",
    FIELDS.map((f) => f.name)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin" className="text-sm text-black/60 underline">
        ← Wróć do panelu
      </Link>

      <h1 className="mt-4 mb-2 text-3xl font-semibold">
        Nasza historia — treść
      </h1>
      <p className="mb-8 text-sm text-black/50">
        Zmiany widoczne będą od razu po zapisaniu na wayra-life.vercel.app.
      </p>

      <ContentBlockForm
        action={boundSave}
        fields={FIELDS}
        initialData={initialData}
      />
    </div>
  );
}
