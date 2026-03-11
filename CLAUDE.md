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

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons. md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items  
2. **Verify Plan**: Check in before starting implementation  
3. **Track Progress**: Mark items complete as you go  
4. **Explain Changes**: High-level summary at each step  
5. **Document Results**: Add review section to `tasks/todo. md`  
6. **Capture Lessons**: Update `tasks/lessons. md` after corrections  

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.