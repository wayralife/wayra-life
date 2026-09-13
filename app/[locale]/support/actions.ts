"use server";

import { createClient } from "@/lib/supabase/server";

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

  return { status: "success" };
}