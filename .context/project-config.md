# Configuración del Proyecto — Bunkai

> Proyecto: **Bunkai**
> Generado: 2026-07-12
> Repo objetivo: `C:\work_sync\workspace\Bunkai-TMS\upex-bunkai-tms`
> Idioma de trabajo QA: español

## Repositorios

| Repositorio | Ruta local | Rama observada | Propósito |
|---|---|---|---|
| Aplicación Bunkai | `../upex-bunkai-tms` | `staging` | Aplicación full-stack bajo prueba: UI Next.js + API Route Handlers + Supabase |
| QA Engineering | `.` | No evaluado en Phase 1 | Boilerplate QA que contiene skills, `.context/`, KATA y automatización |

## Tech Stack

### Frontend

- Framework: Next.js 15 App Router.
- Runtime UI: React 19.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS + componentes Radix/shadcn-style.
- UI especializada: Monaco Editor, TanStack Table, dnd-kit, Lucide.
- Entrada principal: `app/`.
- Fuentes: `../upex-bunkai-tms/package.json:47-78`, `../upex-bunkai-tms/.agents/project.yaml:20-24`.

### Backend

- Tipo: backend dentro del mismo monorepo Next.js.
- Framework: Next.js Route Handlers.
- Entrada API: `app/api`.
- API pública: `/api/v1/**`.
- Contrato API: OpenAPI servido desde rutas internas y `public/openapi.json` según survey Phase 1.
- Autenticación web: Supabase Auth con cookies/session SSR.
- Autenticación API/CLI: Bearer token con Personal Access Token `bk_pat_...`.
- Fuentes: `../upex-bunkai-tms/.agents/project.yaml:15-18`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:46-60`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:231-258`.

### Base de Datos

- Tipo: PostgreSQL.
- Proveedor MVP: Supabase.
- Modelo multi-tenant: Workspaces, Projects, Modules, Stories, ATCs, Tests, Runs.
- Seguridad: Row Level Security en Supabase/Postgres.
- Acceso QA esperado: DBHub MCP configurado desde este repo QA.
- Fuentes: `../upex-bunkai-tms/.agents/project.yaml:26-28`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:61-142`, `../upex-bunkai-tms/supabase/migrations/`.

### Infraestructura

- Cloud MVP: Vercel + Supabase.
- Self-hosted planificado: Docker Compose con Next.js/Postgres/Redis/MinIO/Better Auth, fuera de MVP.
- Observabilidad documentada: Sentry + PostHog, no verificada en dependencias durante Phase 1.
- CI/CD documentado: GitHub Actions, pero no se encontraron workflows locales en `.github/workflows/` durante el survey.
- Fuente: `../upex-bunkai-tms/.context/SRS/architecture-specs.md:1-4`, `../upex-bunkai-tms/.context/SRS/architecture-specs.md:187-190`.

## Entornos

| Entorno | URL Web | URL API | Propósito | Acceso |
|---|---|---|---|---|
| Local | `http://localhost:3000` | `http://localhost:3000/api` | Desarrollo local y validación QA local | Directo |
| Staging | `https://staging-upexbunkai.vercel.app` | `https://staging-upexbunkai.vercel.app/api` | Pruebas pre-release | Requiere credenciales reales en `.env` |
| Production | `https://upexbunkai.vercel.app` | `https://upexbunkai.vercel.app/api` | Producción actual por alias Vercel | Solo lectura salvo autorización explícita |

Fuente: `../upex-bunkai-tms/.agents/project.yaml:52-64`.

## Herramientas y Accesos

- Issue tracker: Jira.
- Project key: `BK`.
- CLI Jira esperado: `acli`.
- DB: Supabase/Postgres vía DBHub MCP o conexión controlada.
- API schema: OpenAPI propio de la app.
- Runtime scripts: Bun.
- Fuentes: `../upex-bunkai-tms/.agents/project.yaml:29-35`, `../upex-bunkai-tms/package.json:7-42`.

## API Spec Source

- Fuente técnica canonical: `../upex-bunkai-tms/public/openapi.json`.
- Runtime endpoint: `/api/openapi`.
- Documentación interactiva: `/api/docs`.
- Generación/sync: target repo expone scripts `openapi:gen`, `openapi:diff` y `api:sync` en `package.json`.
- Fuentes: `../upex-bunkai-tms/app/api/openapi/route.ts:4-26`, `../upex-bunkai-tms/app/api/v1/route.ts:12-19`, `../upex-bunkai-tms/package.json:17-19`.

## Checklist de Acceso

- [x] Acceso de lectura al repo objetivo local.
- [x] Configuración de entornos detectada en `.agents/project.yaml`.
- [x] Contrato de variables detectado en `.env.example`.
- [ ] Acceso Jira verificado en esta sesión.
- [ ] Acceso DB verificado en esta sesión.
- [ ] Staging verificado en navegador/API en esta sesión.
- [ ] CI/CD real verificado: no se encontraron workflows locales.

## Discovery Gaps

- [ ] Confirmar URL final de producción pública (`bunkai.io` vs alias Vercel). Se observó `webapp_domain: bunkai.io`, pero los entornos activos apuntan a Vercel.
- [ ] Confirmar aislamiento real de ambientes Supabase. `local`, `staging` y `production` declaran el mismo `db_project_ref` en `.agents/project.yaml`.
- [ ] Confirmar CI/CD. La arquitectura menciona GitHub Actions, pero no se encontraron workflows locales.
- [ ] Confirmar observabilidad real. Sentry/PostHog están documentados, pero no quedaron verificados como dependencias/config activa en Phase 1.
- [ ] Confirmar estado del dominio self-hosted/Docker Compose. Está planificado para Phase 2, no verificado como implementación actual.
