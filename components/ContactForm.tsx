"use client";

import { useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { submitSupportTicket, type SupportFormState } from "@/app/[locale]/support/actions";

const initialState: SupportFormState = { status: "idle" };

export default function ContactForm() {
  const t = useTranslations("support");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitSupportTicket,
    initialState
  );

  if (state.status === "success") {
    return (
      <p className="rounded-md border border-green-600/30 bg-green-50 p-6 text-green-800">
        {t("success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          {t("nameLabel")} <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-black/20 px-3 py-2.5 focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {t("emailLabel")} <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-black/20 px-3 py-2.5 focus:border-black focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          {t("messageLabel")} <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded-md border border-black/20 px-3 py-2.5 focus:border-black focus:outline-none"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-red-600">
          {state.message === "invalid_email"
            ? t("errorInvalidEmail")
            : t("errorGeneric")}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-black px-8 py-3 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40"
      >
        {isPending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
