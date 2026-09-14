const RESEND_API_URL = "https://api.resend.com/emails";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends a transactional email via Resend (https://resend.com), using a
 * plain `fetch` call so we don't need their SDK as a dependency.
 *
 * This is intentionally best-effort: if RESEND_API_KEY isn't configured
 * yet, or the API call fails, we log it and move on rather than
 * throwing — a broken/missing email setup must never prevent an order
 * from being recorded or a support ticket from being saved.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`RESEND_API_KEY not set — skipped email: "${subject}"`);
    return;
  }

  // Until a custom domain is verified in Resend, only
  // "onboarding@resend.dev" works as a sender (and Resend restricts who
  // it can deliver to in that case) — see the Resend dashboard.
  const from = process.env.EMAIL_FROM || "WAYRA <onboarding@resend.dev>";

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Resend API error", res.status, await res.text());
    }
  } catch (err) {
    console.error("Failed to send email", err);
  }
}
