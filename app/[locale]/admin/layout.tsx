import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-3 text-black/60">
          This account ({user!.email}) is signed in but does not have admin
          access.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-black/10 bg-black/[0.02] px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm text-black/50">
            Signed in as {user!.email}
          </span>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}