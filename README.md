# WAYRA.life

E-commerce platform for WAYRA.life — ceremonial South American plant tools
(rapé, hapé, kuripe, herbs, oils, crafts) sold to the UK market.

This is the **Phase 2 foundation**: project skeleton, database schema, and a
storefront/admin shell. There are no real products yet and payments are not
wired up — see `PROGRESS.md` for the full status and next steps.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl.dev) for English / Polish / Spanish
- Deployed on [Vercel](https://vercel.com)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000 — it redirects to `/en` (or `/pl` / `/es`).

## Project structure

```
src/
  app/[locale]/        storefront pages (home, shop, our-story, support, account, cart)
  app/[locale]/admin/  admin panel skeleton (Phase 4 builds the real functionality)
  components/          shared UI (nav, footer, locale switcher)
  i18n/                next-intl routing/config
  lib/supabase/        Supabase client helpers (browser + server)
  messages/            en.json / pl.json / es.json translation strings
```

## Database

The schema lives in Supabase (project "wayra-life", org "Wayra", region
eu-west-2/London) and is managed through Supabase migrations (applied via the
Supabase MCP connector during this build — see `PROGRESS.md` for the list).
Row Level Security is enabled on every table.

## Environment variables

See `.env.example`. Never commit `.env.local` (it's git-ignored already).
