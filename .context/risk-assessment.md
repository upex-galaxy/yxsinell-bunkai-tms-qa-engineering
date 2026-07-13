# Evaluación de Riesgos — Discovery Phase 1

> Proyecto objetivo: `../upex-bunkai-tms`
> Fecha: 2026-07-12
> Alcance: riesgos detectados para adaptar el QA boilerplate y planificar testing.

## Resumen

| Riesgo | Severidad | Estado | Mitigación recomendada |
|---|---|---|---|
| CI/CD no verificado en repo | HIGH | No se encontraron `.github/workflows/*` | Confirmar con el equipo si CI vive fuera del repo o crear pipeline antes de confiar en regression automation. |
| Sin script `test` explícito | MEDIUM | Hay tests `*.test.ts`, pero `package.json` no expone `test` | Confirmar comando real (`bun test` según docs internas) y agregar script estándar si aplica. |
| Drift entre docs y migraciones | HIGH | Docs mencionan algunas entidades/features no confirmadas en migraciones actuales | Usar migraciones/DB live como autoridad para Phase 2/3; marcar features planificadas como gaps. |
| Aislamiento de entornos Supabase | HIGH | `local`, `staging` y `production` declaran mismo `db_project_ref` | Confirmar estrategia de datos antes de ejecutar pruebas destructivas o write-heavy. |
| Observabilidad no verificada | MEDIUM | Sentry/PostHog documentados; no confirmados como implementación activa | Validar dependencias/config y definir cómo capturar errores durante QA. |
| Self-hosted aún planificado | MEDIUM | Docker Compose figura como Phase 2, no implementación actual | No incluir self-hosted en alcance MVP salvo confirmación explícita. |

## Testing Maturity

- Score estimado: **2/4 — Moderate**.
- Estado actual: existen múltiples tests unitarios `*.test.ts` bajo `lib/**`, TypeScript strict y quality tooling.
- Limitación: no se verificó runner E2E ni script `test` estándar en `package.json`.
- Fuentes: `../upex-bunkai-tms/package.json:7-42`, `../upex-bunkai-tms/tsconfig.json`, `../upex-bunkai-tms/.husky/`.

## Documentation State

- Estado estimado: **Good/Complete**.
- Evidencia: README, CONTEXT, DESIGN, `.context/business`, `.context/PRD`, `.context/SRS`, ADR/PBI en el repo objetivo.
- Riesgo: parte de la documentación parece aspiracional o planificada; debe contrastarse con código antes de generar tests.

## CI/CD Maturity

- Estado estimado: **None / Not verified**.
- Evidencia: no se encontraron workflows locales en `.github/workflows/*` durante survey.
- Nota: SRS menciona GitHub Actions, pero esa afirmación queda como gap hasta verificar fuente real.

## Discovery Gaps

- [ ] Confirmar pipeline CI/CD real.
- [ ] Confirmar comando oficial de test unitario/integration.
- [ ] Confirmar si los tres entornos comparten Supabase por decisión temporal o por configuración incompleta.
- [ ] Confirmar schema vivo de DB vía DBHub/Supabase antes de diseñar pruebas DB profundas.
- [ ] Confirmar cuáles features son MVP real vs Phase 2/3 planificadas.
