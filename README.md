# MartialOps

Training-load and readiness tracker for martial-arts gyms. **Fitore**.

Two numbers:
- **Readiness** — a 1–100 daily score derived from sleep, soreness, stress, and injury status.
- **Training Load** — per-session load from duration × intensity × session-type multiplier (configurable per gym).

Athletes log sessions and daily check-ins; coaches see gym-wide load and readiness and approve new members.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Auth | NextAuth 5 (beta) with Google OAuth |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 (+ `@prisma/adapter-pg`) |
| Styling | Tailwind CSS 4 + custom CSS tokens |
| Motion | `motion` (Framer Motion v12) |
| Testing (unit) | Vitest |
| Testing (e2e) | Playwright (auth-perimeter coverage) |
| Deploy target | Vercel |

---

## Prerequisites

- **Node.js 20+**
- **npm** (the repo's lockfile is npm)
- **Docker** (for the local Postgres via `docker-compose.yml`) — or a Postgres 16+ instance you provide
- **Google OAuth credentials** (for login) — create at [console.cloud.google.com](https://console.cloud.google.com)

---

## Quick start (local dev)

```bash
# 1. Install dependencies (postinstall runs `prisma generate`)
npm install

# 2. Start the local Postgres container
docker compose up -d

# 3. Create a .env file with the variables listed below

# 4. Apply migrations to the local DB
npx prisma migrate dev

# 5. (Optional) Seed a dev user + gym + membership
npx tsx prisma/seed.ts

# 6. Start the dev server
npm run dev
```

App runs on [http://localhost:3000](http://localhost:3000).

### Stopping / resetting

```bash
docker compose down              # stop Postgres
docker compose down -v           # stop AND drop the pgdata volume (wipes the DB)
npx prisma migrate reset         # reset schema + reseed
```

---

## Environment variables

Create a `.env` in the repo root. None are committed; `.env*` is gitignored.

```env
# Postgres — matches docker-compose.yml defaults
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

# Google OAuth (create a client in Google Cloud Console → OAuth 2.0)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

When deploying to Vercel, add these same variables in **Project Settings → Environment Variables** (Production + Preview). `NEXTAUTH_URL` becomes your deployed URL.

### Optional — only set these to enable the feature

Rate limiting (Upstash Redis):

```env
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

If both are set, sliding-window rate limits are enforced on write/search/join/approval endpoints. If unset, limits are no-op (helpful for local dev). Sign up at [upstash.com](https://upstash.com) → create a Redis database → copy the REST URL + token.

Error monitoring (Sentry):

```env
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
```

Run `npx @sentry/wizard@latest -i nextjs` once and the wizard will create the config files and prompt for these values.

---

## Database (Prisma)

Schema lives at `prisma/schema.prisma`. The generated client is output to `src/generated/prisma/` (gitignored).

```bash
npx prisma migrate dev --name <short-description>   # create + apply new migration in dev
npx prisma migrate deploy                           # apply pending migrations (used in Vercel build)
npx prisma studio                                   # visual DB browser
npx tsx prisma/seed.ts                              # seed dev user + gym
```

Migration history is committed under `prisma/migrations/` — do not delete or reorder these.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Run `prisma migrate deploy` then `next build` (used by Vercel) |
| `npm start` | Start the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright e2e (auto-starts dev server if not running) |

Also useful:

```bash
npx tsc --noEmit       # type-check without emitting
npx prisma generate    # regenerate Prisma client
```

---

## Testing

Unit tests live next to the code: `src/lib/*.test.ts`. Current coverage:

- `scoring.ts` — `calcLoad` and `calcReadiness` formulas
- `history.ts` — `buildActivityDays` day-grouping
- `auth-guards.ts` — role-hierarchy checks (`requireGymMember` at all permission tiers)

```bash
npm test                   # one-shot
npm run test:watch         # watcher
```

End-to-end tests live in `e2e/` and currently lock down the auth perimeter — every protected page redirects unauthenticated visitors to sign-in, and every protected API route returns `401`. Three suites:

- `e2e/auth.spec.ts` — page redirects (`/dashboard`, `/athlete`, `/athlete/history`) + `POST /api/sessions` returns 401
- `e2e/onboarding-api.spec.ts` — every `/api/gyms*` route returns 401 without a session
- `e2e/dashboard-api.spec.ts` — `/api/dashboard/{day,summary}` return 401 without a session

```bash
npm run test:e2e           # auto-starts dev server on :3000 if none is running
```

Authenticated-flow coverage (signup → onboard → log session → view history) is not yet written.

---

## Project structure

```
MartialOps/
├── .github/
│   └── workflows/
│       └── ci.yml                 # lint + type-check + vitest on PR + push to main
├── docker-compose.yml             # local Postgres 16 on :5432
├── docs/                          # (gitignored) local dev notes
├── prisma/
│   ├── schema.prisma              # models: User, Gym, Membership, TrainingSession, CheckIn, GymSettings, NextAuth tables
│   ├── migrations/                # committed migration history
│   └── seed.ts                    # dev user + gym + membership
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # root layout
│   │   ├── page.tsx               # home (role-aware; renders HomeHero/Cards or HomePending)
│   │   ├── HomeHero.tsx           # hero for active members
│   │   ├── HomeCards.tsx          # action cards (athlete/coach)
│   │   ├── HomePending.tsx        # styled "awaiting approval" state
│   │   ├── login/                 # /login (Google OAuth)
│   │   ├── onboarding/            # /onboarding — create gym OR search + request join
│   │   ├── profile/               # /profile — identity record + pending-access card
│   │   ├── athlete/               # /athlete — training log form
│   │   │   └── history/           # /athlete/history — lifetime stats + activity log
│   │   ├── dashboard/             # /dashboard — coach overview
│   │   │   └── settings/          # /dashboard/settings — gym multipliers + weights
│   │   ├── how-it-works/          # /how-it-works — product explainer
│   │   ├── design/                # (dev-only reference — NOT linked) palette, backgrounds, warm/cool modes
│   │   ├── privacy/               # /privacy — stub legal
│   │   ├── terms/                 # /terms — stub legal
│   │   ├── globals.css            # Tailwind 4 + design tokens (warm/cool themes)
│   │   └── api/                   # API routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── sessions/route.ts          # POST/GET training sessions
│   │       ├── checkins/route.ts          # POST/GET daily check-ins
│   │       ├── gyms/route.ts              # POST create, GET search
│   │       ├── gyms/[id]/settings/route.ts       # GET/PATCH gym multipliers
│   │       ├── gyms/[id]/requests/route.ts       # POST membership request
│   │       ├── gyms/[id]/requests/[userId]/route.ts  # POST/PATCH approve/reject
│   │       └── dashboard/
│   │           ├── day/route.ts           # single day's sessions + check-in
│   │           └── summary/route.ts       # monthly summary for calendar heatmap
│   ├── components/
│   │   ├── Navbar.tsx             # top nav (server component)
│   │   ├── Footer.tsx
│   │   ├── ConditionalNavbar.tsx  # hides nav on /login
│   │   ├── ConditionalFooter.tsx
│   │   ├── SignOutButton.tsx
│   │   ├── ThemeToggle.tsx        # warm ↔ cool mode
│   │   ├── PageHeader.tsx
│   │   └── Ornaments.tsx          # SVG primitives (eagle, dot grids, brackets, rulers, blobs)
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton (with pg adapter)
│   │   ├── scoring.ts             # calcLoad, calcReadiness + tests
│   │   ├── history.ts             # buildActivityDays + tests
│   │   └── auth-guards.ts         # requireGymMember role checks + tests
│   ├── auth.ts                    # NextAuth entry
│   ├── auth.config.ts             # NextAuth config
│   └── generated/prisma/          # (gitignored) generated Prisma client
├── e2e/                           # Playwright auth-perimeter tests (auth.spec.ts, onboarding-api.spec.ts, dashboard-api.spec.ts)
├── public/
│   ├── double-headed-eagle.svg
│   └── theme-init.js              # applies theme before hydration
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.mjs
└── package.json
```

---

## Design system

Two themes driven by a `data-theme` attribute on `<html>`:

- **Warm (default)** — "Honey Cream" palette: cream canvas, mahogany ink, burnt-orange accent
- **Cool** — "Glacial Sky" palette: dove slate canvas, midnight ink, sky-blue accent

Tokens are defined in `src/app/globals.css` under `@theme` (warm) and `:root[data-theme="cool"]` overrides.

Typographic system uses Barlow (display, 800) for brutalist headings and Jakarta (sans) for body, with editorial/Monocle-style accents: numbered sections (`§ 01`), masthead meta strips, printer's-mark dots, measured rulers.

`/design/*` routes are **dev-only reference pages** — not linked from nav, kept buildable for local swatch-checking.

---

## Deploy (Vercel)

1. Push the repo to GitHub.
2. In Vercel, **Import Project** and select the repo.
3. Framework preset auto-detects Next.js — no override needed.
4. Add the environment variables from the [Environment variables](#environment-variables) section.
5. Connect a Postgres provider (Neon, Supabase, Vercel Postgres, Railway, etc.) and use its connection string as `DATABASE_URL`.
6. Deploy.

**First deploy** runs `prisma migrate deploy` (applies the 5 committed migrations) before `next build`. Subsequent deploys apply any new migrations automatically. If a migration fails, the build fails — the bad code never reaches production.

---

## CI

`.github/workflows/ci.yml` runs on every pull request and every push to `main`:

1. `npm ci`
2. `npx prisma generate`
3. `npx tsc --noEmit`
4. `npm run lint`
5. `npm test`

Vercel handles `next build` on deploy; CI intentionally skips it to avoid redundant work. Playwright is **not** in CI yet — running it requires a Postgres service in the workflow + browser binaries. See the dev notes for the trade-off and decision options.

---

## Contributing / conventions

- **Commits**: small, focused, present-tense subject (e.g. `feat: add invite-code flow`, `fix: clamp readiness under 1`).
- **No verbose comments.** Code and identifiers should carry meaning; only add a comment when the *why* is genuinely non-obvious (hidden constraint, subtle invariant, workaround).
- **Prisma schema changes** always go through `npx prisma migrate dev --name <desc>` — never hand-edit the DB or use `db push` in a way that diverges from migrations.
- **Design language**: ~60–65% editorial polish, ~35–40% brutalist accent. Monocle, not Awwwards.

---

## License

Private / internal. All rights reserved.
