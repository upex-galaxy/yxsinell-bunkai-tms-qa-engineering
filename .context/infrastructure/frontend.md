# Frontend Infrastructure — Bunkai

> Discovery date: 2026-07-12
> Target repo: `../upex-bunkai-tms`
> Scope: Next.js App Router UI, browser configuration, selectors, static assets.

## Build Configuration

| Item | Value | Evidence |
|---|---|---|
| Framework | Next.js 15 | `package.json:67` |
| UI runtime | React 19 | `package.json:69-70` |
| Router | App Router | `app/**/page.tsx`, `.context/PRD/user-journeys.md` |
| Bundler | Next default toolchain; local script does not pass `--turbo` | `package.json:8`, `next.config.ts` |
| Output mode | SSR/RSC + Route Handlers; no static export configured | `next.config.ts:4-11` |
| TypeScript | Strict, bundler module resolution, typed routes enabled | `tsconfig.json:3-29`, `next.config.ts:7` |
| Styling | Tailwind CSS 3.4 + Radix-style component stack | `package.json:52-56`, `package.json:87-95` |

## Framework Config Snippet

```ts
const config = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  typedRoutes: true,
  images: {
    remotePatterns: [],
  },
};
```

Source: `../upex-bunkai-tms/next.config.ts:4-11`.

## Client Environment Variables

| Key | Browser exposed | Purpose | Evidence |
|---|---:|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | `.env.example:92-103` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Legacy anon key still read by app runtime | `.env.example:108-109` |
| `NEXT_PUBLIC_APP_URL` | Yes | App base URL for redirects/email links | `.env.example:137-143` |

No secret-looking `NEXT_PUBLIC_*SECRET*` key was found in `.env.example` during Phase 3 survey.

## Environment-Specific Values

| Environment | Web URL | API URL | Source |
|---|---|---|---|
| Local | `http://localhost:3000` | `http://localhost:3000/api` | `.agents/project.yaml:105-110` |
| Staging | `https://staging-upexbunkai.vercel.app` | `https://staging-upexbunkai.vercel.app/api` | `.agents/project.yaml:111-115` |
| Production | `https://upexbunkai.vercel.app` | `https://upexbunkai.vercel.app/api` inferred | `.agents/project.yaml:10`, `.env.example:158-160` |

## Static Assets

```text
public/
  openapi.json
```

| Asset | Purpose | Evidence |
|---|---|---|
| `public/openapi.json` | Static OpenAPI contract served by `/api/openapi` | `public/openapi.json`, `app/api/openapi/route.ts` |

## Image Handling

| Item | Value | Evidence |
|---|---|---|
| Next Image remote patterns | Empty array | `next.config.ts:8-10` |
| External image domains | None configured | `next.config.ts:8-10` |
| Custom loader | Not configured | `next.config.ts` |

## Code Splitting Strategy

| Signal | Status | Evidence |
|---|---|---|
| App Router route-level splitting | Present by framework convention | `app/**/page.tsx` |
| Explicit `dynamic(...)` / `React.lazy` inventory | Not verified in this pass | Discovery gap |
| Monaco editor dependency | Present, likely lazy-load candidate | `package.json:51` |

## Bundle Size Notes

No bundle analyzer, Lighthouse CI, or measured bundle budget was found in `package.json`. Bundle size remains unmeasured in Phase 3.

## Performance Configuration

| Area | Current config | Evidence |
|---|---|---|
| React strict mode | Enabled | `next.config.ts:5` |
| Typed routes | Enabled | `next.config.ts:7` |
| Image optimization | No remote images configured | `next.config.ts:8-10` |
| Fonts | Not inventoried in Phase 3 | Discovery gap |
| OpenAPI route cache | 300s cache on API spec | `app/api/openapi/route.ts` |

## SEO Configuration

| Item | Status | Evidence |
|---|---|---|
| `robots.txt` | Not found in `public/` | Phase 3 asset scan |
| `sitemap.xml` | Not found in `public/` | Phase 3 asset scan |
| OG images | Not found in `public/` | Phase 3 asset scan |
| Route metadata | Not fully inventoried | Discovery gap |

## Browser Support / Polyfills

| Item | Value | Evidence |
|---|---|---|
| Target | Modern browsers supported by Next.js 15 / React 19 | Framework default |
| Explicit browserslist | Not found in `package.json` | `package.json` |
| Polyfills | No explicit polyfill package inventoried | `package.json` |

## Routing + State + Auth Integration Points

| Area | Implementation | QA Hook |
|---|---|---|
| Routing | Next App Router pages under `app/` | Navigate route map from `.context/PRD/user-journeys.md` |
| Auth | Supabase SSR cookie session, middleware protected routes | Login/session setup must preserve cookies |
| API auth | Bearer PAT and cookie session converge in backend `Principal` | Hybrid UI/API tests can validate parity |
| State | Server/RSC + component-local state; no Redux/Zustand dependency found | Prefer UI assertions over global store hooks |
| Tables | `@tanstack/react-table` | Workbench/table interactions likely table-driven |
| Drag/drop | `@dnd-kit/*` | Reorder flows need drag/drop-capable Playwright actions |
| Selectors | Broad `data-testid` usage found | Prefer `data-testid` for automation where user-facing role/name is insufficient |

## Selector Strategy

`data-testid` is already used across critical QA surfaces: tests builder, reorder, runner, QA docs page, and tag editor. Examples: `runner-view`, `runner-finish-button`, `new-test-builder`, `test-reorder-save`, `qa-page`.

Evidence: grep hits in `components/runs/RunnerView.tsx`, `components/tests/*.tsx`, `app/qa/_components/*.tsx`.

## Discovery Gaps

- [ ] No measured bundle budget, Lighthouse CI, or bundle analyzer command found.
- [ ] Explicit route metadata/SEO files were not fully inventoried.
- [ ] Explicit code-splitting imports were not exhaustively scanned.
- [ ] Browser support policy is framework-default; no project-specific browser matrix found.
- [ ] Visual regression or accessibility test setup not verified in target repo.

## QA Relevance

- Use `data-testid` selectively for complex widgets (runner, drag/drop, builders), but prefer role/name where stable.
- Drag/drop test automation is needed for reorder flows using `@dnd-kit`.
- Auth tests must account for middleware redirects and `next` query preservation.
- Staging URL is known, but reachability was not checked in this phase.
