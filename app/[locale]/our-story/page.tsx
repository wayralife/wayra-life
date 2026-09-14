import { getContentBlock } from "@/lib/content";

interface OurStoryContent {
  title?: string;
  body?: string;
  imageUrl?: string;
}

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = await getContentBlock<OurStoryContent>("our_story", locale);

  const title = content?.title || "Our Story";
  const body = content?.body || "More coming soon.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {content?.imageUrl && (
        // Plain img, not next/image: this URL is set by the admin and can
        // come from any host.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.imageUrl}
          alt=""
          className="mb-8 w-full rounded-lg object-cover"
        />
      )}
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="mt-4 whitespace-pre-line text-black/70">{body}</div>
    </div>
  );
}
