# Infrastructure Map — Bunkai

> Discovery date: 2026-07-12
> Target repo: `../upex-bunkai-tms`
> Scope: CI/CD, deployment, environments, secrets, external services, rollback.

## Overview

```mermaid
graph TB
  Dev[Developer / QA] --> Local[Local Next.js app]
  Local --> SupabaseLocal[Supabase/Postgres env vars]
  Dev --> Git[Git repository]
  Git --> Vercel[Vercel deployment - inferred]
  Vercel --> SupabaseCloud[Supabase Cloud]
  Vercel --> Resend[Resend]
  Vercel --> Jira[Jira import/sync]
  QA[QA Automation] --> Staging[Staging URL]
  QA --> API[/api/v1 + /api/openapi]
```

## CI/CD Configuration

| Platform | Status | Evidence |
|---|---|---|
| GitHub Actions | Not present in target repo | `.github/workflows/*` scan returned no files |
| Vercel CI/build | Inferred, not versioned | `.agents/project.yaml` URLs and `.env.example` Vercel comments |
| Local quality gate | Present | `bun run repo:check` in `package.json:35` |

### Local Quality Gate

```bash
bun run repo:check
```

This expands to:

```bash
bun run format:check && bun run lint:check && bun run types:check && bun run vars:check && bun run vars:env:check && bun run skills:check && bun run skills:registry:check
```

Source: `../upex-bunkai-tms/package.json:35`.

## Deployment Configuration

| Item | Value | Evidence |
|---|---|---|
| Hosting platform | Vercel inferred | `.agents/project.yaml:10`, `.env.example:115-119`, `.env.example:158-160` |
| Build command | `bun run build` -> `next build` | `package.json:8-10` |
| Runtime start | `bun run start` -> `next start` | `package.json:10` |
| Docker | Not present | Docker/deploy scan returned no files |
| Netlify/Fly/Render/Terraform/Pulumi | Not present | Deploy/IaC scan returned no files |

No `vercel.json` was found, so platform config is not versioned in repo. Vercel project settings may hold build, env, and routing configuration.

## Environments Matrix

| Environment | URL | Branch | Auto Deploy | Approval | Source |
|---|---|---|---|---|---|
| Local | `http://localhost:3000` | local checkout | Manual | n/a | `.agents/project.yaml:105-110` |
| Staging | `https://staging-upexbunkai.vercel.app` | Not verified | Not verified | Not verified | `.agents/project.yaml:111-115`, `.env.example:158-160` |
| Production | `https://upexbunkai.vercel.app` | Not verified, likely `main` | Not verified | Not verified | `.agents/project.yaml:10`, `.env.example:158-160` |
| Preview | Vercel preview URL pattern | PR/branch | Inferred Vercel default | Not verified | Platform convention; not versioned |

## Environment Variables By Environment

| Key Family | Local | Staging | Production | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://staging-upexbunkai.vercel.app` | `https://upexbunkai.vercel.app` | `.env.example` lists redirect URLs. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Required | Required | Source of environment isolation; project refs must be confirmed. |
| `SUPABASE_*` keys | Required | Required | Required | Never commit values. |
| `POSTGRES_*` keys | Required for direct DB/tooling | Required for direct DB/tooling | Required for direct DB/tooling | `.env.example:122-134`. |
| `ATLASSIAN_*` | Required for Jira sync/import | Required if integration enabled | Required if integration enabled | Tooling credential family. |
| `RESEND_API_KEY` | Optional unless email feature used | Required if email enabled | Required if email enabled | Transactional email. |

## Secrets Management

| Secret | Storage | Access Scope | Evidence |
|---|---|---|---|
| Supabase project keys | `.env` locally; Vercel env inferred for deploy | App runtime + MCP/tooling | `.env.example:92-119` |
| Postgres URLs/password | `.env` locally; Vercel env inferred for deploy | Server/tooling only | `.env.example:122-134` |
| Atlassian token | `.env` locally | Jira scripts, `acli`, optional MCP | `.env.example:33-55` |
| Resend API key | `.env` locally; deploy env inferred | App/tooling email | `.env.example:73-80` |
| Supabase MCP PAT | `.env` locally | Admin control plane; not browser | `.env.example:83-90` |

## Cloud Services

| Service | Provider | Purpose | Evidence |
|---|---|---|---|
| Web hosting | Vercel inferred | Next.js app hosting | URLs and Vercel comments in config/env docs |
| Database/Auth | Supabase | Postgres, Auth, RLS, JWT/OAuth callbacks | `.env.example:92-164`, `supabase/migrations/` |
| Email | Resend | Transactional email | `.env.example:73-80` |
| Issue tracker | Atlassian Jira | Import/sync work items | `.env.example:33-55`, `package.json:24-28` |
| Automation workflows | n8n | Workflow automation MCP | `.env.example:65-71` |

## Database Infrastructure

| Item | Value | Evidence |
|---|---|---|
| Provider | Supabase Cloud inferred | `.env.example:92-119` |
| DB type | PostgreSQL | `.env.example:122-134` |
| Region | Not verified | Discovery gap |
| Backups | Not verified | Discovery gap |
| Connection modes | Pooled and direct URLs documented | `.env.example:129-134` |
| Shared refs risk | Needs confirmation across local/staging/production | Phase 1 risk assessment |

## Infrastructure Resources

```mermaid
graph LR
  Browser[Browser] --> App[Vercel Next.js App]
  Agent[AI Agent / CLI] --> API[Next.js Route Handlers]
  App --> SupabaseAuth[Supabase Auth]
  App --> Postgres[(Supabase Postgres + RLS)]
  API --> Postgres
  API --> Jira[Jira]
  App --> Resend[Resend]
  OpenAPI[public/openapi.json] --> Docs[/api/docs + /api/openapi]
```

## Infrastructure as Code

| Tool | Location | Status |
|---|---|---|
| Terraform | n/a | Not found |
| Pulumi | n/a | Not found |
| Kubernetes/Helm | n/a | Not found |
| Docker Compose | n/a | Not found |
| Vercel config file | n/a | Not found |

Deployment/IaC configuration appears platform-managed rather than repo-managed.

## Monitoring & Observability

| Area | Status | Evidence |
|---|---|---|
| Request IDs | Verified in API wrapper from Phase 2 | `.context/SRS/architecture.md` |
| Structured API errors | Verified in API wrapper from Phase 2 | `.context/SRS/architecture.md` |
| Sentry/PostHog | Mentioned as target/gap, not verified active | `.context/SRS/non-functional-specs.md` |
| Uptime monitoring | Not verified | Discovery gap |
| Log retention | Not verified | Discovery gap |

## Deployment Checklist

### Pre-deploy

```bash
bun install
bun run repo:check
bun run build
bun run openapi:diff
```

### Post-deploy Smoke

```bash
curl https://staging-upexbunkai.vercel.app/api/v1
curl https://staging-upexbunkai.vercel.app/api/openapi
```

### Rollback

No repo-versioned rollback procedure was found. If Vercel is confirmed as source of truth, rollback likely uses Vercel dashboard/CLI redeploy of a prior deployment; this requires human confirmation.

## Discovery Gaps

- [ ] CI/CD source of truth not verified; no `.github/workflows/*` exists in target repo.
- [ ] No `vercel.json` or versioned deploy config found; Vercel settings may be dashboard-managed.
- [ ] Branch-to-environment mapping for staging/production not verified.
- [ ] Supabase project refs per environment not verified; environment isolation remains high-risk.
- [ ] Region, backups, and restore policy not verified.
- [ ] Monitoring/alerting stack not verified.
- [ ] Rollback procedure not documented in repo.
- [ ] Environment URL reachability not checked in Phase 3.

## QA Relevance

- Staging is default QA target: `https://staging-upexbunkai.vercel.app`.
- Smoke should start with `/api/v1`, `/api/openapi`, login redirect behavior, and Supabase-backed workspace access.
- Release readiness cannot rely on CI until pipeline source of truth is confirmed.
- Write-heavy tests must not run until Supabase environment isolation is confirmed.
