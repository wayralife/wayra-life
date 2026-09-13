# WAYRA.life — Phase 2 progress (project foundation)

Status as of this session: **database schema live, app skeleton built and
committed locally.** GitHub push and Vercel connection could not be
completed automatically this session (no working GitHub/Vercel API access
in this run) — see "Manual steps still needed" below.

## What's done

### 1. Database (Supabase project "wayra-life", eu-west-2/London)

Project URL: `https://cozkfotqsiooycygshzi.supabase.co`

All tables from the Phase 1 architecture doc (section C) were created via
migration, with Row Level Security enabled on every table:

- `profiles` (extends Supabase auth.users, role customer/admin), with an
  `is_admin()` helper function and an auto-create-profile trigger on signup
- `addresses`
- `categories`, `category_translations`
- `products`, `product_translations`, `product_images`
- `compliance_notes` (admin-only, never exposed publicly)
- `discounts` (admin-only; codes validated server-side later)
- `orders`, `order_items`, `payments`, `shipments`
- `support_tickets`, `ai_conversations`, `ai_actions`, `audit_log`
- `content_blocks`

RLS policy summary: customers can see/manage their own profile, addresses,
orders and support tickets; anyone can read active/visible products,
categories and content; `compliance_notes`, `discounts`, `payments`,
`ai_actions`, `ai_conversations` and `audit_log` are admin-only (the future
server-side code will use a service-role key for AI agents / webhooks,
which bypasses RLS by design).

4 placeholder categories were seeded (Rapé/Hapé, Kuripe & Tepi, Herbs &
Oils, Ceremonial Crafts) with EN/PL/ES translations, purely so the
homepage has something real to display. No products yet — that starts in
Phase 3.

Supabase security advisor was run after the migrations; the one relevant
finding (a trigger function being technically callable via the REST RPC
endpoint) was fixed by revoking that permission.

### 2. Next.js application (`wayra-life/` folder in this session's workspace)

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Locale-prefixed routing (`/en`, `/pl`, `/es`) via `next-intl`, English
  default
- Pages: Home, Shop, Our Story, Support, Account, Cart — all real routes
  with real (if minimal) content, no "fake coming soon" placeholders beyond
  what's explicitly labelled as a future phase
- Home page queries Supabase live for the category list and shows a
  connection-status line, proving the Supabase connection works end to end
- `/admin` section: dashboard + Products/Orders/Categories/Customers/
  Content/Settings, each a clearly-labelled skeleton page (no business
  logic — that's Phase 4). **Not yet access-controlled** — before Phase 4
  ships anything real, `/admin` must be gated so only `role = admin`
  profiles can reach it.
- Supabase client helpers for both Server and Client Components, using
  generated TypeScript types from the live schema
- `.env.example` documents every environment variable needed now and later
  (Stripe/Claude/email keys are listed but empty — nothing is faked)
- Production build (`npm run build`) passes clean

## Manual steps still needed

This session's GitHub and Vercel connectors could not create a repository
or a deployment (the Vercel MCP tools returned an internal error for every
call in this run, and there was no working GitHub API access to create a
new repository under the wayra.life account). The code is complete and
committed locally with git — it just needs to be pushed and connected.
Grzegorz, when you're back, either:

**A. Ask Claude to do it in an interactive session** — reconnecting the
GitHub/Vercel integrations usually resolves itself when done live rather
than on a schedule.

**B. Do it yourself in ~10 minutes** — see the step-by-step Polish
instructions in the chat summary / `claude/phase1-architecture.md` project
notes.

## Next steps (Phase 3)

Once the code is on GitHub and deployed to Vercel:
1. Build the real Shop/Product pages against the `products` table
2. Build cart + checkout flow (Stripe integration is Phase 5, but the cart
   UI itself can be built now against placeholder data)
3. Add authentication (Supabase Auth) for Account pages
4. Start filling in real product data via a simple admin form (still ahead
   of full Phase 4 admin, but needed before Phase 3 can show anything real)
