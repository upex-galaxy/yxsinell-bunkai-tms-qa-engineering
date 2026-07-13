# Backend Infrastructure — Bunkai

> Discovery date: 2026-07-12
> Target repo: `../upex-bunkai-tms`
> Scope: Next.js Route Handlers + Supabase/Postgres backend surface.

## Runtime Environment

| Item | Value | Evidence |
|---|---|---|
| Runtime | Bun for scripts; Next.js runtime for app/API | `../upex-bunkai-tms/package.json:7-43` |
| Language | TypeScript, strict mode | `../upex-bunkai-tms/tsconfig.json:3-29` |
| Framework | Next.js 15 App Router + Route Handlers | `../upex-bunkai-tms/package.json:67`, `../upex-bunkai-tms/app/api/v1/route.ts` |
| Package manager | Bun inferred from scripts and README | `../upex-bunkai-tms/package.json:11-42`, `../upex-bunkai-tms/README.md:54-63` |
| Database | Supabase Postgres | `../upex-bunkai-tms/.env.example:92-134`, `../upex-bunkai-tms/supabase/migrations/` |

## Package Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Local development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve built app |
| `typecheck` | `tsc --noEmit` | Type check alias |
| `types:check` | `tsc --noEmit` | Type check used by repo checks |
| `lint:check` | `eslint .` | Lint full repo |
| `format:check` | `prettier --check '**/*.{json,yml,yaml,css,scss,html}' --ignore-path .prettierignore` | Format check |
| `repo:check` | `bun run format:check && bun run lint:check && bun run types:check && bun run vars:check && bun run vars:env:check && bun run skills:check && bun run skills:registry:check` | Local quality gate |
| `api:sync` | `bun scripts/sync-openapi.ts` | Sync OpenAPI types/spec |
| `openapi:gen` | `bun scripts/openapi-gen.ts` | Generate OpenAPI JSON |
| `openapi:diff` | `bun scripts/openapi-diff.ts` | Detect OpenAPI drift |

Source: `../upex-bunkai-tms/package.json:7-43`.

## Core Dependencies

| Category | Package | Version | Purpose |
|---|---|---|---|
| Web framework | `next` | `^15` | UI + API Route Handlers |
| UI runtime | `react`, `react-dom` | `^19` | React Server/Client Components |
| Database/Auth client | `@supabase/supabase-js` | `^2.106.0` | Supabase data/auth client |
| SSR auth | `@supabase/ssr` | `^0.10.3` | Cookie-aware Supabase SSR client |
| Validation | `zod` | `^4.4.3` | Runtime validation and API schemas |
| OpenAPI | `@asteasolutions/zod-to-openapi` | `^8.5.0` | Schema-to-OpenAPI generation |
| API docs | `@scalar/api-reference-react` | `^0.9.38` | OpenAPI/Scalar docs UI |
| Email | Resend key configured | n/a | Transactional email integration via `RESEND_API_KEY` |

Source: `../upex-bunkai-tms/package.json:44-96`, `../upex-bunkai-tms/.env.example:73-80`.

## Environment Variables

### Required Runtime

| Key | Scope | Purpose | Evidence |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser/server | Supabase project URL | `.env.example:92-103` |
| `SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Supabase publishable key | `.env.example:103-106` |
| `SUPABASE_SECRET_KEY` | Server only | Server-side Supabase secret | `.env.example:105-107` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/server legacy | Legacy anon key still read by app runtime | `.env.example:108-109` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only legacy | Legacy service role key still read by app runtime | `.env.example:110-111` |
| `SUPABASE_JWT_SECRET` | Server only | Custom JWT sign/verify | `.env.example:112-113` |
| `NEXT_PUBLIC_APP_URL` | Browser/server | Base URL for auth redirects and email links | `.env.example:137-143` |

### Database / Direct Connection

| Key | Scope | Purpose | Evidence |
|---|---|---|---|
| `POSTGRES_HOST` | Server/tooling | Supabase Postgres host | `.env.example:122-134` |
| `POSTGRES_USER` | Server/tooling | Postgres user | `.env.example:125-128` |
| `POSTGRES_PASSWORD` | Server/tooling | Postgres password | `.env.example:125-128` |
| `POSTGRES_DATABASE` | Server/tooling | Postgres database name | `.env.example:125-128` |
| `POSTGRES_URL` | Server/tooling | Pooled connection URL | `.env.example:129-130` |
| `POSTGRES_URL_NON_POOLING` | Server/tooling | Direct connection URL | `.env.example:131-132` |
| `POSTGRES_PRISMA_URL` | Server/tooling | Pooled Prisma-compatible URL | `.env.example:133-134` |

### External Services / Tooling

| Key | Scope | Purpose | Evidence |
|---|---|---|---|
| `ATLASSIAN_URL`, `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN` | Tooling/integration | Jira sync/import tooling | `.env.example:33-55` |
| `RESEND_API_KEY` | App/tooling | Transactional email | `.env.example:73-80` |
| `SUPABASE_ACCESS_TOKEN` | Tooling | Supabase MCP control plane | `.env.example:83-90` |
| `TAVILY_API_KEY` | Tooling | Web search MCP | `.env.example:58-63` |
| `N8N_API_URL`, `N8N_API_KEY` | Tooling | n8n MCP/workflow automation | `.env.example:65-71` |

## Database Configuration

| Item | Value | Evidence |
|---|---|---|
| Provider | Supabase Postgres | `.env.example:92-134` |
| Schema source of truth | SQL migrations under `supabase/migrations/` | `supabase/migrations/README.md:1-7` |
| Migration naming | `NNNN_<slug>.sql` | `supabase/migrations/README.md:3-5` |
| Apply mechanism documented | Supabase MCP `apply_migration`; ledger row in `supabase_migrations.schema_migrations` | `supabase/migrations/README.md:5-7` |
| ORM | No ORM confirmed; app uses Supabase clients/RPCs | No Prisma/Drizzle package in `package.json` |
| RLS | Workspace-scoped RLS and RPCs | `supabase/migrations/0001_tenancy.sql`, `supabase/migrations/0031_runs.sql` |

## Migration Commands

No local migration CLI script is exposed in `package.json`. Documented project convention applies migrations through Supabase MCP, not a copy-paste shell command.

```bash
# Inspect available migrations
ls supabase/migrations

# Validate repo health after migration file changes
bun run repo:check
```

## Build Configuration

| Item | Value | Evidence |
|---|---|---|
| Build command | `bun run build` -> `next build` | `package.json:8-10` |
| Serve command | `bun run start` -> `next start` | `package.json:10` |
| TypeScript target | `ES2022`, `moduleResolution: bundler`, `strict: true` | `tsconfig.json:3-29` |
| Path aliases | `@/*`, `@app/*`, `@components/*`, `@lib/*` | `tsconfig.json:11-16` |
| Next output | Default Next output; no `output: 'standalone'` configured | `next.config.ts:4-11` |

## Local Development Setup

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env
# Edit .env with Supabase, Postgres, Atlassian, Resend, and app URL keys.

# 3. Validate setup variables and repo health
bun run setup:doctor
bun run repo:check

# 4. Start development server
bun run dev

# 5. Verify API discovery endpoint
curl http://localhost:3000/api/v1
```

## Health Check Endpoints

| Endpoint | Status | Notes |
|---|---|---|
| `/api/v1` | Implemented | Discovery/live endpoint returns API surface metadata. |
| `/api/openapi` | Implemented | Public OpenAPI JSON with 300s cache. |
| `/api/health` | Not verified | No dedicated health route found during Phase 2/3 survey. |

## Discovery Gaps

- [ ] No standard `test` script exists in `package.json`, despite `lib/**/*.test.ts` files being present.
- [ ] No local migration apply/reset/seed script is exposed; migration execution depends on Supabase MCP convention.
- [ ] Live DB was not queried; migrations are treated as local source of truth.
- [ ] Dedicated `/api/health` endpoint not verified.
- [ ] Exact Bun version pin not found in `package.json` engines or a version file.

## QA Relevance

- Automation should use `/api/v1` and `/api/openapi` as smoke probes, not assume `/api/health`.
- Test data setup must respect Supabase RLS and workspace membership.
- Backend verification should include cookie session and Bearer PAT parity.
- Repo health command is `bun run repo:check`; unit test command remains a gap until team exposes one.
