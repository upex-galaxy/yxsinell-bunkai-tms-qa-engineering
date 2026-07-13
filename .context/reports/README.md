# reports/ — Reportes de Sprint

Hogar histórico para frameworks de testing a nivel sprint. Un archivo por sprint, generado y mantenido por la skill `/sprint-testing` en modo batch-sprint.

Los reportes de sprint son agregados cross-ticket; viven acá para no quedar enterrados dentro del contenido por ticket en `.context/PBI/`.

## Convención de nombres

`SPRINT-{N}-TESTING.md`, donde `{N}` es el número de sprint.

Ejemplos: `SPRINT-9-TESTING.md`, `SPRINT-10-TESTING.md`.

## Qué contiene cada archivo

- Roadmap Wave 1 / Wave 2 de tickets del sprint.
- Estado por ticket (PENDING / PASSED / FAILED), link ATP, link ATR, TCs.
- Tickets carryover del sprint anterior.
- Asignación de QA lead y conteo de no asignados.

## Lifecycle

| Stage | Trigger | Actor |
|---|---|---|
| **Created** | `/sprint-testing` §Session Start step 0.5, cuando se detecta batch mode y el archivo falta o está stale > 24h | skill `/sprint-testing` |
| **Updated** | Después de completar Stage 3 para cada ticket del sprint | skill `/sprint-testing` |
| **Retained** | Nunca se borra — reportes antiguos quedan para auditoría y análisis de tendencias | — |

El framework file es la fuente de verdad para progreso de sprint.

## Cómo consumir

- Abrir el archivo más reciente para ver estado del sprint en curso.
- Comparar archivos consecutivos para detectar carryovers recurrentes.
- Alimentar herramientas de retro-prep o dashboards.

## Relacionado

- Artefactos por ticket (ATPs, ATRs, evidence) -> `.context/PBI/`.
- Estrategia de testing sprint-wide -> `.context/master-test-plan.md`.
