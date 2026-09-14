"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import {
  supportTicketAdminNotification,
  supportTicketCustomerAck,
} from "@/lib/email-templates";

export interface SupportFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitSupportTicket(
  _prevState: SupportFormState,
  formData: FormData
): Promise<SupportFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const locale = String(formData.get("locale") ?? "en").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "missing_fields" };
  }
  if (!email.includes("@")) {
    return { status: "error", message: "invalid_email" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("support_tickets").insert({
    name,
    email,
    message,
    subject: `Website contact form — ${name}`,
    channel: "web",
    status: "open",
  });

  if (error) {
    return { status: "error", message: "server_error" };
  }

  // Best-effort notifications — never block the ticket from being saved
  // if either email fails to send (see lib/email.ts).
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminNotification = supportTicketAdminNotification({
      name,
      email,
      message,
    });
    await sendEmail({
      to: adminEmail,
      subject: adminNotification.subject,
      html: adminNotification.html,
      replyTo: email,
    });
  } else {
    console.error("ADMIN_EMAIL not set — skipped support ticket notification");
  }

  const customerAck = supportTicketCustomerAck(locale);
  await sendEmail({
    to: email,
    subject: customerAck.subject,
    html: customerAck.html,
  });

  return { status: "success" };
}
