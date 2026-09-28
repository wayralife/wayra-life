"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { updateOrderStatus } from "@/app/[locale]/admin/orders/actions";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped (emails customer)" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded (emails customer)" },
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleSave() {
    if (status === currentStatus) return;

    if (
      (status === "refunded" || status === "shipped") &&
      !confirm(
        status === "refunded"
          ? "Set this order to Refunded and email the customer a refund confirmation?"
          : "Set this order to Shipped and email the customer a shipping notification?"
      )
    ) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.ok) {
        setMessage("Saved.");
        router.refresh();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-md border border-black/15 px-3 py-2 text-sm"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || status === currentStatus}
        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        {isPending ? "Saving…" : "Update status"}
      </button>
      {message && <span className="text-sm text-black/50">{message}</span>}
    </div>
  );
}