// Server-only helper that asks Claude to translate a set of English text
// fields into Polish and Spanish, for the "Translate automatically" button
// in the admin forms. Uses plain fetch (no SDK dependency) against the
// Anthropic Messages API.

const DEFAULT_MODEL = "claude-3-5-haiku-20241022";

export interface TranslationResult {
  pl: Record<string, string>;
  es: Record<string, string>;
}

export async function translateFields(
  sourceTexts: Record<string, string>
): Promise<TranslationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const entries = Object.entries(sourceTexts).filter(([, v]) => v?.trim());
  if (entries.length === 0) {
    return { pl: {}, es: {} };
  }

  const model = process.env.TRANSLATE_MODEL || DEFAULT_MODEL;

  const prompt = `Translate the following English e-commerce website text fields into Polish and Spanish. Keep the tone natural and appropriate for a shop selling South American ceremonial products (rapé, hapé, herbs, crafts). Preserve any HTML-free line breaks. Respond with ONLY a JSON object, no other text, in exactly this shape:
{"pl": {"<field>": "<polish text>", ...}, "es": {"<field>": "<spanish text>", ...}}

Fields to translate:
${JSON.stringify(Object.fromEntries(entries), null, 2)}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Translation API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Translation response did not contain JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    pl: parsed.pl ?? {},
    es: parsed.es ?? {},
  };
}
