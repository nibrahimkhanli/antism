# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**antism.com** — Sponsorship marketplace connecting businesses (sponsors) with creators (podcasters, athletes, event organizers). Targets Azerbaijan + Russia markets. Platform takes 30% commission per deal.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npx tsc --noEmit   # Type-check without compiling
```

## Stack

- **Next.js 15** (App Router, `src/` dir) + **TypeScript**
- **Supabase** — PostgreSQL + Auth + Storage (via `@supabase/ssr`)
- **shadcn/ui v4** — uses `@base-ui/react` (NOT Radix). Key difference: use `render` prop instead of `asChild`, `onValueChange` returns `value | null`
- **next-intl** — i18n with locale routing `/az/`, `/en/`, `/ru/`
- **Tailwind CSS v4**

## Architecture

### Route Structure

```
app/[locale]/
  (public)/           # Landing, browse marketplace, creator public profiles
  (auth)/             # login, register
  onboarding/         # Post-registration profile setup (creator type + details | sponsor details)
  (creator)/creator/dashboard/   # Creator-only: packages, deals, profile, payouts
  (sponsor)/sponsor/dashboard/   # Sponsor-only: deals, payments
  auth/callback/      # Supabase auth callback route
```

Route groups `(creator)` and `(sponsor)` each have their own `layout.tsx` that enforces auth + role redirect.

### Supabase Schema (key tables)

- `profiles` — extends `auth.users`, has `role` (creator|sponsor), `country` (AZ|RU), `language`
- `creators` — linked to `profiles`, has `type` (podcaster|athlete|event), `social_links` (JSON), `reach_count`
- `sponsors` — linked to `profiles`, has `company_name`, `industry`
- `packages` — creator's sponsorship packages with `price` (in cents), `currency` (AZN|RUB), `deliverables` (JSON array)
- `deals` — links sponsor + creator + package, tracks `status` through lifecycle
- `deal_events` — status history/timeline for each deal
- `payments` — per-deal payment records (provider: payriff|yookassa)
- `reviews` — post-deal ratings
- `creator_cards` view — denormalized view for browse/marketplace page

Full schema: `supabase/schema.sql` — run in Supabase SQL Editor.

### Supabase Clients

- `src/lib/supabase/client.ts` — browser client (use in `'use client'` components)
- `src/lib/supabase/server.ts` — server client (use in Server Components, Route Handlers, middleware)
- `src/lib/supabase/types.ts` — shared TypeScript types + `formatPrice()` + `calculateFees()`

### i18n

- Config: `src/i18n/routing.ts` (locales: az, en, ru; default: az), `src/i18n/request.ts`
- Middleware: `src/middleware.ts`
- Messages: `messages/az.json`, `messages/en.json`, `messages/ru.json`
- All UI strings must be in message files — no hardcoded text

### Business Logic

- Platform fee: 30% (`PLATFORM_FEE_PERCENT` in `types.ts`)
- `calculateFees(price)` returns `{ platformFee, creatorPayout }`
- Currency: AZN (₼) for Azerbaijan, RUB (₽) for Russia. Prices stored in smallest unit (qəpik/kopek × 100)
- Payments: PAYRIFF (AZ), YooKassa (RU) — not yet integrated, stubs ready in `src/lib/payments/`

### Deal Lifecycle

`pending` → `accepted` → `in_progress` (after creator submits proof) → `completed` (after sponsor confirms) or `cancelled` | `disputed`

Each status change logs a row to `deal_events`.

## shadcn/ui v4 Patterns

**Do NOT use `asChild` prop** — it doesn't exist in base-ui. Instead:

```tsx
// Button as link — use Link with buttonVariants
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
<Link href="..." className={cn(buttonVariants({ variant: 'outline' }))}>text</Link>

// DropdownMenuTrigger — just nest Button as child (no asChild)
<DropdownMenuTrigger>
  <Button variant="ghost">...</Button>
</DropdownMenuTrigger>

// DropdownMenuItem as link — use render prop
<DropdownMenuItem render={<Link href="..." />}>Label</DropdownMenuItem>

// Select onValueChange — value can be null
<Select onValueChange={v => v && setValue(v)}>
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (Settings → API)
- `NEXT_PUBLIC_BASE_URL` — `http://localhost:3000` for dev, `https://antism.com` for prod