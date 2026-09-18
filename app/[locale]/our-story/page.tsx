import { getContentBlock } from "@/lib/content";

interface OurStoryContent {
  title?: string;
  body?: string;
  imageUrl?: string;
}

/**
 * Renders body text where a line starting with "## " is treated as a
 * section heading (simple markdown-lite, not a full parser) — this lets
 * admin-edited content have real visual structure (like "Our Mission",
 * "Why We Are Unique") without needing a rich text editor in the CMS.
 */
function renderBody(body: string) {
  // A single line break is enough to start a new paragraph/heading — some
  // browsers/paste sources collapse blank lines down to one, so requiring
  // two newlines here was too strict.
  const paragraphs = body.split(/\n+/).filter((block) => block.trim() !== "");

  return paragraphs.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 mb-3 text-xl font-semibold text-black">
          {block.slice(3).trim()}
        </h2>
      );
    }
    return (
      <p key={i} className="mt-4 whitespace-pre-line text-black/70">
        {block}
      </p>
    );
  });
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
      {renderBody(body)}
    </div>
  );
}