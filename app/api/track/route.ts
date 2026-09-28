import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : null;
    const locale =
      typeof body.locale === "string" ? body.locale.slice(0, 10) : null;
    const visitorId =
      typeof body.visitorId === "string" ? body.visitorId.slice(0, 100) : null;
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    if (!path || !locale || !visitorId) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const supabase = createAdminClient();
    await supabase.from("page_views").insert({
      path,
      locale,
      visitor_id: visitorId,
      referrer,
    });
  } catch (err) {
    console.error("Failed to record page view", err);
  }

  return NextResponse.json({ ok: true });
}