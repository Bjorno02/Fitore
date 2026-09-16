# MartialOps

Training-load and readiness tracker for martial-arts gyms. **Fitore**.

Two numbers:
- **Readiness** — a 1–100 daily score derived from sleep, soreness, stress, and injury status.
- **Training Load** — per-session load from duration × intensity × session-type multiplier (configurable per gym).

Athletes log sessions and daily check-ins; coaches see gym-wide load and readiness. Athletes join via coach-generated invite codes — no public search, no approval queue.

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

# NextAuth v5 (Auth.js)
AUTH_URL="http://localhost:3000"
AUTH_SECRET="<generate with: openssl rand -base64 32>"

# Google OAuth (create a client in Google Cloud Console → OAuth 2.0)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

When deploying to Vercel, add these same variables in **Project Settings → Environment Variables** (Production + Preview). `AUTH_URL` is auto-detected from `VERCEL_URL` on Vercel — you can omit it there.

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
npx prisma migrate deploy                           # apply pending migrations (CI runs this in the Migrate stage)
npx prisma studio                                   # visual DB browser
npx tsx prisma/seed.ts                              # seed dev user + gym
```

Migration history is committed under `prisma/migrations/` — do not delete or reorder these.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | `next build` only; migrations run in the pipeline's Migrate stage |
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

End-to-end tests live in `e2e/` (21 cases across six suites). Most lock down the auth perimeter — every protected page redirects unauthenticated visitors to sign-in, and every protected API route returns `401` — plus a mobile-viewport suite:

- `e2e/auth.spec.ts` — page redirects (`/dashboard`, `/athlete`, `/athlete/history`) + `POST /api/sessions` returns 401
- `e2e/dashboard-api.spec.ts` — `/api/dashboard/{day,summary}` return 401 without a session
- `e2e/invite-codes.spec.ts` — generate/list/revoke/redeem invite-code routes all require auth
- `e2e/memberships.spec.ts` — roster, remove-member, change-role, and leave-gym routes all require auth
- `e2e/sessions-checkins.spec.ts` — session and check-in edit/delete routes all require auth
- `e2e/mobile.spec.ts` — no horizontal overflow at 375px, gated-route redirect on mobile, touch-target floor on the sign-in button

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
│       └── pipeline.yml           # build → unit → e2e → migrate → deploy → smoke (see CI/CD)
├── vercel.json                    # disables Vercel's own deploys of main; the pipeline deploys production
├── docker-compose.yml             # local Postgres 16 on :5432
├── docs/                          # (gitignored) local dev notes
├── prisma/
│   ├── schema.prisma              # 9 models: User, Gym, Membership, TrainingSession, CheckIn, InviteCode, GymSettings + NextAuth (Account, Session)
│   ├── migrations/                # committed migration history
│   └── seed.ts                    # dev user + gym + membership
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # root layout
│   │   ├── page.tsx               # home (role-aware; renders HomeHero/Cards or HomePending)
│   │   ├── HomeHero.tsx           # hero for active members
│   │   ├── HomeCards.tsx          # action cards (athlete/coach)
│   │   ├── login/                 # /login (Google OAuth)
│   │   ├── onboarding/            # /onboarding — create a gym OR redeem an invite code
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
│   │       ├── sessions/route.ts             # POST/GET training sessions
│   │       ├── sessions/[id]/route.ts        # DELETE/PATCH own session
│   │       ├── checkins/route.ts             # POST/GET daily check-ins
│   │       ├── checkins/[id]/route.ts        # DELETE/PATCH own check-in
│   │       ├── memberships/me/route.ts       # DELETE leave gym (any member)
│   │       ├── actions/active-gym.ts         # server action: setActiveGym
│   │       ├── gyms/route.ts              # POST create gym
│   │       ├── gyms/[id]/settings/route.ts       # GET/PUT gym multipliers
│   │       ├── invite-codes/route.ts             # POST generate, GET list (coach/admin)
│   │       ├── invite-codes/[id]/route.ts        # DELETE revoke (coach/admin)
│   │       ├── invite-codes/redeem/route.ts      # POST redeem code (athlete)
│   │       ├── gyms/[id]/members/route.ts        # GET roster (coach/admin)
│   │       ├── gyms/[id]/members/[userId]/route.ts  # DELETE remove, PATCH change role (admin)
│   │       ├── memberships/me/route.ts           # DELETE leave gym (any member)
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
├── e2e/                           # Playwright suites: auth, dashboard-api, invite-codes, memberships, sessions-checkins, mobile
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
4. Add the environment variables from the [Environment variables](#environment-variables) section. `DATABASE_URL` can be type **Secret**; nothing reads it at build time.
5. Create a Neon project with two branches, `production` and `preview`, and set `DATABASE_URL` per Vercel environment so Preview never touches production data.
6. Set up the GitHub secrets and environments listed under [CI/CD](#cicd). Production is deployed by the pipeline on push to `main`; Vercel's own Git integration only builds previews for other branches, because `vercel.json` disables it for `main`.

**Migrations** are not part of the build. The pipeline's Migrate stage runs `prisma migrate deploy` after the tests pass and before Deploy Production, so a failing migration blocks the deploy and the bad code never reaches production. The build itself never opens a database connection.

---

## CI/CD

`.github/workflows/pipeline.yml` is a single chained workflow, so the Actions run page draws it as one graph:

```
App Build  ─┐
            ├─→ End-to-End Tests → Migrate → Deploy Production → Smoke Test
Unit Tests ─┘
```

App Build and Unit Tests run in parallel; everything after waits for both.

Runs on every pull request, every push to `main`, and `workflow_dispatch`.

1. **App Build** — `vercel pull` + `vercel build` (Preview env on PRs, Production env on `main`) as a compile check. Secret-type Vercel variables arrive from `vercel pull` as the placeholder `[SENSITIVE]`, so the job strips those lines before building and sets a dummy `DATABASE_URL` because `prisma generate` refuses to run without one; every build-time consumer (Upstash client, Sentry upload) must tolerate the variable being unset. Runtime on Vercel still gets the real values. The build never connects to a database.
2. **Unit Tests** — `prisma generate`, `tsc --noEmit`, `eslint`, `vitest`.
3. **End-to-End Tests** — Postgres 16 service, `prisma migrate deploy`, Chromium, Playwright suites. On failure the job uploads a `playwright-report` artifact (HTML report plus traces and screenshots of the failing tests, kept 7 days); download it from the run's Summary page and open `index.html`, or run `npx playwright show-report <folder>`.
4. **Migrate** — `prisma migrate deploy` against the `preview` Neon branch on PRs and the `production` branch on `main`. The connection string comes from a GitHub environment secret, so Vercel's own `DATABASE_URL` can stay type Secret.
5. **Deploy Production** — push to `main` only. Pulls the Production env, runs `vercel build --prod`, and deploys that output with `vercel deploy --prebuilt --prod`, all on one runner. Vercel's prebuilt output for Next.js references files in `.next` and `node_modules` by path, including build-generated shims, so it is not portable between machines; an earlier version of this pipeline that shipped it as an artifact deployed a build whose Sentry instrumentation could not load (2026-09-16). Runs under the `production` GitHub environment.
6. **Smoke Test** — hits `https://fitore.vercel.app`, the production domain, not the per-deployment URL (those sit behind Vercel Deployment Protection and redirect to Vercel SSO). `/login` must return 200 (retried for up to a minute while the deployment warms), `/` must 307 to `/login` for a signed-out visitor, and `POST /api/sessions` and `GET /api/dashboard/summary` must return 401. Catches a bad runtime env var, a dead database connection, or an init crash. If it fails, `vercel rollback <previous-deployment-url>` restores the previous production deployment; the bare `vercel rollback` did nothing when tried.

PRs stop after Migrate. In-progress PR runs are cancelled by a newer push to the same branch; runs on `main` are never cancelled mid-deploy.

### Required GitHub secrets

Repository secrets (Settings → Secrets and variables → Actions):

| Secret | Source |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens, scope Full Account |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` after `vercel link` |
| `SENTRY_AUTH_TOKEN` | optional; Sentry → Settings → Auth Tokens. Without it the build still passes but skips source-map upload |

Environment secrets (Settings → Environments), one per environment, both named `DATABASE_URL`:

| Environment | Value |
|---|---|
| `preview` | connection string of the Neon `preview` branch |
| `production` | connection string of the Neon `production` branch |

### Vercel

`vercel.json` sets `git.deploymentEnabled.main = false` so Vercel's own integration no longer deploys `main` on push; the pipeline is the only path to production. Preview deploys for other branches are unchanged.

Vercel's `DATABASE_URL` is read only at runtime, so keep it type **Secret**. Preview and Production must point at different Neon branches; the pipeline migrates each one separately.

### Branch protection

Require the `App Build`, `Unit Tests`, `End-to-End Tests`, and `Migrate` checks on `main` so a PR cannot merge until they pass.

---

## Contributing / conventions

- **Commits**: small, focused, present-tense subject (e.g. `feat: add invite-code flow`, `fix: clamp readiness under 1`).
- **No verbose comments.** Code and identifiers should carry meaning; only add a comment when the *why* is genuinely non-obvious (hidden constraint, subtle invariant, workaround).
- **Prisma schema changes** always go through `npx prisma migrate dev --name <desc>` — never hand-edit the DB or use `db push` in a way that diverges from migrations.
- **Design language**: ~60–65% editorial polish, ~35–40% brutalist accent. Monocle, not Awwwards.

---

## License

Private / internal. All rights reserved.
