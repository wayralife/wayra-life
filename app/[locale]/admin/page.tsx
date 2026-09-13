import { createClient } from "@/lib/supabase/server";

const SECTIONS = [
  "Products",
  "Categories",
  "Orders",
  "Customers",
  "Content",
  "Settings",
];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Admin</h1>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium">Recent support messages</h2>
        {!tickets || tickets.length === 0 ? (
          <p className="text-black/50">No messages yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-md border border-black/10 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium">
                    {ticket.name} — {ticket.email}
                  </span>
                  <span className="text-xs text-black/40">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-black/70">
                  {ticket.message}
                </p>
                <span className="mt-2 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/50">
                  {ticket.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-medium">Coming in later phases</h2>
        <ul className="grid grid-cols-2 gap-3">
          {SECTIONS.map((section) => (
            <li
              key={section}
              className="rounded-md border border-black/10 p-4 text-black/60"
            >
              {section}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}