/**
 * Plain-string HTML email templates. Kept dependency-free (no React
 * Email / JSX) since these are simple enough to hand-write, and it
 * avoids pulling in another rendering step just for a handful of emails.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const ORDER_COPY = {
  en: {
    subject: (ref: string) => `Your WAYRA order #${ref} is confirmed`,
    heading: "Thank you for your order!",
    intro:
      "We've received your payment and your order is now being prepared.",
    orderRef: "Order reference",
    itemsHeading: "Order summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    footer:
      "We'll email you again once your order ships. Questions? Just reply to this email or contact us at info@wayra.life.",
  },
  pl: {
    subject: (ref: string) =>
      `Twoje zamówienie WAYRA #${ref} zostało potwierdzone`,
    heading: "Dziękujemy za zamówienie!",
    intro:
      "Otrzymaliśmy Twoją płatność i zamówienie jest już przygotowywane.",
    orderRef: "Numer zamówienia",
    itemsHeading: "Podsumowanie zamówienia",
    subtotal: "Suma częściowa",
    shipping: "Wysyłka",
    total: "Razem",
    footer:
      "Napiszemy do Ciebie ponownie, gdy zamówienie zostanie wysłane. Masz pytania? Odpisz na tego maila albo napisz na info@wayra.life.",
  },
  es: {
    subject: (ref: string) => `Tu pedido WAYRA #${ref} está confirmado`,
    heading: "¡Gracias por tu pedido!",
    intro: "Hemos recibido tu pago y tu pedido ya se está preparando.",
    orderRef: "Referencia del pedido",
    itemsHeading: "Resumen del pedido",
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
    footer:
      "Te escribiremos de nuevo cuando se envíe tu pedido. ¿Tienes preguntas? Responde a este correo o escríbenos a info@wayra.life.",
  },
} as const;

export type SupportedEmailLocale = keyof typeof ORDER_COPY;

export function isSupportedEmailLocale(
  locale: string
): locale is SupportedEmailLocale {
  return locale in ORDER_COPY;
}

export interface OrderEmailItem {
  name: string;
  qty: number;
  unitPrice: number;
}

export interface OrderEmailData {
  orderId: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
}

export function orderConfirmationEmail(
  locale: string,
  data: OrderEmailData
): { subject: string; html: string } {
  const t = isSupportedEmailLocale(locale) ? ORDER_COPY[locale] : ORDER_COPY.en;
  const ref = data.orderId.slice(0, 8).toUpperCase();

  const rows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(
          item.name
        )} × ${item.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${formatMoney(
          item.unitPrice * item.qty,
          data.currency
        )}</td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-size:22px;margin-bottom:4px;">${t.heading}</h1>
    <p style="color:#555;">${t.intro}</p>
    <p style="color:#888;font-size:13px;">${t.orderRef}: <strong>${ref}</strong></p>

    <h2 style="font-size:16px;margin-top:24px;">${t.itemsHeading}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>

    <table style="width:100%;margin-top:12px;font-size:14px;">
      <tr><td>${t.subtotal}</td><td style="text-align:right;">${formatMoney(
    data.subtotal,
    data.currency
  )}</td></tr>
      <tr><td>${t.shipping}</td><td style="text-align:right;">${formatMoney(
    data.shipping,
    data.currency
  )}</td></tr>
      <tr style="font-weight:bold;"><td style="padding-top:8px;">${
        t.total
      }</td><td style="text-align:right;padding-top:8px;">${formatMoney(
    data.total,
    data.currency
  )}</td></tr>
    </table>

    <p style="margin-top:32px;color:#888;font-size:13px;">${t.footer}</p>
  </div>`;

  return { subject: t.subject(ref), html };
}

const SHIPPED_COPY = {
  en: {
    subject: (ref: string) => `Your WAYRA order #${ref} has shipped`,
    heading: "Your order is on its way!",
    intro: "Good news — your order has been dispatched.",
    orderRef: "Order reference",
    footer:
      "Questions about delivery? Just reply to this email or contact us at info@wayra.life.",
  },
  pl: {
    subject: (ref: string) => `Twoje zamówienie WAYRA #${ref} zostało wysłane`,
    heading: "Twoje zamówienie jest w drodze!",
    intro: "Dobra wiadomość — Twoje zamówienie zostało wysłane.",
    orderRef: "Numer zamówienia",
    footer:
      "Pytania dotyczące dostawy? Odpisz na tego maila albo napisz na info@wayra.life.",
  },
  es: {
    subject: (ref: string) => `Tu pedido WAYRA #${ref} ha sido enviado`,
    heading: "¡Tu pedido está en camino!",
    intro: "Buenas noticias — tu pedido ha sido enviado.",
    orderRef: "Referencia del pedido",
    footer:
      "¿Preguntas sobre la entrega? Responde a este correo o escríbenos a info@wayra.life.",
  },
} as const;

export function orderShippedEmail(
  locale: string,
  orderId: string
): { subject: string; html: string } {
  const t = isSupportedEmailLocale(locale) ? SHIPPED_COPY[locale] : SHIPPED_COPY.en;
  const ref = orderId.slice(0, 8).toUpperCase();

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-size:22px;margin-bottom:4px;">${t.heading}</h1>
    <p style="color:#555;">${t.intro}</p>
    <p style="color:#888;font-size:13px;">${t.orderRef}: <strong>${ref}</strong></p>
    <p style="margin-top:32px;color:#888;font-size:13px;">${t.footer}</p>
  </div>`;

  return { subject: t.subject(ref), html };
}

const REFUNDED_COPY = {
  en: {
    subject: (ref: string) => `Your WAYRA order #${ref} has been refunded`,
    heading: "Your refund has been processed",
    intro: (amount: string) =>
      `We've processed a refund of ${amount} for this order. It can take a few business days to appear on your statement, depending on your bank.`,
    orderRef: "Order reference",
    footer:
      "Questions about this refund? Just reply to this email or contact us at info@wayra.life.",
  },
  pl: {
    subject: (ref: string) => `Zwrot dla zamówienia WAYRA #${ref} został zrealizowany`,
    heading: "Twój zwrot został przetworzony",
    intro: (amount: string) =>
      `Zrealizowaliśmy zwrot w wysokości ${amount} za to zamówienie. Zaksięgowanie środków może potrwać kilka dni roboczych, w zależności od banku.`,
    orderRef: "Numer zamówienia",
    footer:
      "Pytania dotyczące zwrotu? Odpisz na tego maila albo napisz na info@wayra.life.",
  },
  es: {
    subject: (ref: string) => `Se ha reembolsado tu pedido WAYRA #${ref}`,
    heading: "Tu reembolso ha sido procesado",
    intro: (amount: string) =>
      `Hemos procesado un reembolso de ${amount} para este pedido. Puede tardar unos días hábiles en aparecer en tu extracto, según tu banco.`,
    orderRef: "Referencia del pedido",
    footer:
      "¿Preguntas sobre este reembolso? Responde a este correo o escríbenos a info@wayra.life.",
  },
} as const;

export function orderRefundedEmail(
  locale: string,
  orderId: string,
  amount: number,
  currency: string
): { subject: string; html: string } {
  const t = isSupportedEmailLocale(locale) ? REFUNDED_COPY[locale] : REFUNDED_COPY.en;
  const ref = orderId.slice(0, 8).toUpperCase();
  const amountLabel = formatMoney(amount, currency);

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-size:22px;margin-bottom:4px;">${t.heading}</h1>
    <p style="color:#555;">${t.intro(amountLabel)}</p>
    <p style="color:#888;font-size:13px;">${t.orderRef}: <strong>${ref}</strong></p>
    <p style="margin-top:32px;color:#888;font-size:13px;">${t.footer}</p>
  </div>`;

  return { subject: t.subject(ref), html };
}

export interface SupportTicketEmailData {
  name: string;
  email: string;
  message: string;
}

export function supportTicketAdminNotification(
  data: SupportTicketEmailData
): { subject: string; html: string } {
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-size:20px;">New contact form message</h1>
    <p><strong>From:</strong> ${escapeHtml(data.name)} (${escapeHtml(
    data.email
  )})</p>
    <p style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px;color:#333;">${escapeHtml(
      data.message
    )}</p>
  </div>`;

  return {
    subject: `New WAYRA contact form message from ${data.name}`,
    html,
  };
}

const TICKET_ACK_COPY = {
  en: {
    subject: "We've received your message",
    heading: "Thanks for reaching out!",
    body: "We've received your message and will get back to you as soon as possible.",
    footer: "This is an automatic confirmation — no need to reply to it.",
  },
  pl: {
    subject: "Otrzymaliśmy Twoją wiadomość",
    heading: "Dziękujemy za kontakt!",
    body: "Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej, jak to możliwe.",
    footer: "To automatyczne potwierdzenie — nie musisz na nie odpowiadać.",
  },
  es: {
    subject: "Hemos recibido tu mensaje",
    heading: "¡Gracias por escribirnos!",
    body: "Hemos recibido tu mensaje y te responderemos lo antes posible.",
    footer: "Esta es una confirmación automática — no es necesario responder.",
  },
} as const;

export function supportTicketCustomerAck(locale: string): {
  subject: string;
  html: string;
} {
  const t =
    locale in TICKET_ACK_COPY
      ? TICKET_ACK_COPY[locale as keyof typeof TICKET_ACK_COPY]
      : TICKET_ACK_COPY.en;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111;">
    <h1 style="font-size:20px;">${t.heading}</h1>
    <p style="color:#555;">${t.body}</p>
    <p style="margin-top:24px;color:#888;font-size:13px;">${t.footer}</p>
  </div>`;

  return { subject: t.subject, html };
}