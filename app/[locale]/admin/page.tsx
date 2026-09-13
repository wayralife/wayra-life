// Admin panel skeleton — no auth guard yet (see Phase 2 notes).
// Do not put real customer/order data behind this page until an
// authentication + role check is added (Phase 4).
const SECTIONS = [
  "Dashboard",
  "Products",
  "Categories",
  "Orders",
  "Customers",
  "Content",
  "Settings",
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-red-600">
        Not authentication-protected yet — placeholder only (Phase 4).
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-3">
        {SECTIONS.map((section) => (
          <li
            key={section}
            className="rounded-md border border-black/10 p-4 text-black/60"
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
}
