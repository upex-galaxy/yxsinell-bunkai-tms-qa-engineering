# `.context/ADR/` — Architecture Decision Records (arquitectura de testing)

Registro append-only de las decisiones de arquitectura de testing importantes y difíciles de revertir tomadas en este proyecto. Un archivo por decisión. Las decisiones nunca se borran: se **superseden** con ADRs nuevos que enlazan hacia atrás, para que la historia de _por qué la suite de tests es como es_ permanezca intacta.

Objetivo: que una futura sesión humana o AI pueda leer estos ADRs en vez de volver a discutir una decisión ya tomada o violar silenciosamente un invariante de testing que no conocía, por ejemplo cambiar el modelo de fixtures en un ticket y romper isolation en toda la suite.

> Acá “Architecture” significa **arquitectura de testing**, no arquitectura de producto. Una mala decisión de test-framework, fixtures o isolation es de las cosas más caras de revertir: reescribís la suite. Por eso el trabajo de testing es especialmente buen candidato para ADRs.

---

## Qué es un ADR y qué no es

Un ADR captura una sola decisión: el contexto que la forzó, la opción elegida, las alternativas rechazadas y las consecuencias aceptadas por el equipo. Es un **documento fuente de verdad**, no una cache: nada lo regenera, y se versiona en git como el código de tests.

Es el artefacto correcto cuando una decisión pasa **ambas** puertas:

| Gate | Pregunta |
|---|---|
| **1 — Architectural** | ¿Da forma a la estructura de la suite, a una preocupación transversal de testing o a un invariante que todo test debe respetar? |
| **2 — Hard to reverse** | ¿Cambiarla después implicaría reescribir muchos tests, migrar fixtures/test data setup o coordinar al equipo QA? |

Ejemplos que merecen ADR: elección de test-runner/framework con lock-in real (Playwright vs Cypress vs WebdriverIO), Page-Object vs Screenplay vs raw, estrategia de fixtures/test-data (factories vs seeded DB vs API setup vs static fixtures), modelo de test-isolation y parallelization (per-worker DB, transactional rollback, namespacing), estrategia auth-in-tests (storageState reuse vs login-per-test vs token injection), contrato de selectors/`data-testid` con la app, frontera exploratory-vs-scripted, reporting/CI sharding, política de flake-retry y timeouts.

**NO es ADR**:

- Fix de flaky test o root cause → Engram `mem_save` + regression report.
- Renombrar un test file, un `waitFor` puntual, elegir assertion helper para un spec → solo commit.
- Scaffolding de test single-use → no requiere registro.
- **Decisiones locales de ticket** (qué fixture para un ATC, un selector tweak, un trade-off de un spec) → quedan en `acceptance-test-planning.md` / automation plan del ticket bajo `## Technical Decisions`. Promover a ADR **solo** si pasa ambas puertas.

---

## Status lifecycle

```
Proposed ──→ Accepted ──→ Superseded   (by ADR-NNNN, which links back)
                   └────→ Deprecated   (no longer applies; nothing replaces it)
```

- **Proposed** — redactado, en discusión, todavía no vinculante.
- **Accepted** — vinculante. El trabajo downstream de tests debe respetarlo.
- **Superseded** — un ADR nuevo lo reemplaza. Setear `Superseded by: ADR-NNNN`; el ADR nuevo setea `Supersedes: ADR-MMMM`. **No editar el cuerpo viejo**: queda como registro histórico.
- **Deprecated** — la decisión ya no aplica y no hay reemplazo.

**Append-only.** Nunca borrar un ADR. Nunca reescribir una decisión después de Accepted: superseder con un ADR nuevo. La única edición in-place permitida en un ADR Accepted es cambiar su `Status` y agregar `Superseded by` / `Deprecated`.

---

## Cómo escribir uno

1. Copiar [`ADR-NNNN-template.md`](./ADR-NNNN-template.md) a `ADR-<NNNN>-<slug>.md`.
   - `<NNNN>` = siguiente número libre de 4 dígitos, zero-padded (`0001`, `0002`, ...). **Asignarlo manualmente; no hay script:** abrir este README, leer el **Index**, tomar `max(existing NNNN) + 1`, y zero-pad a 4 dígitos. El Index es el único allocator. Los números nunca se reutilizan.
   - `<slug>` = resumen corto kebab-case (`playwright-over-cypress`, `transactional-test-isolation`).
2. Completar todas las secciones. Si la decisión sigue abierta, setear `Status: Proposed` y explicar qué falta resolver.
3. Agregar una fila al **Index**.
4. Si supersede un ADR existente, enlazar ambos lados (`Supersedes` / `Superseded by`) y cambiar el `Status` del viejo.

Autoría: un QA architect/lead humano directamente, **o** un workflow AI que detectó una decisión ADR-worthy y la redactó para aprobación humana: `/project-discovery` (SRS / infrastructure test-architecture), `/framework-development` (KATA layers, fixtures, runner), y `/sprint-testing` + `/test-automation` (Stage 1 / Phase 1 planning). En todos los casos, humano aprueba antes de `Status: Accepted`.

---

## Index

| ADR | Title | Status | Supersedes | Superseded by |
|---|---|---|---|---|
| _— none yet —_ | El primer ADR suele sembrarse durante `/project-discovery` (SRS / infrastructure), `/framework-development`, o el primer `/sprint-testing` · `/test-automation` que fuerce una decisión de test-architecture difícil de revertir. | | | |

> Mantener esta tabla sincronizada cada vez que se agregue un ADR o cambie su estado. Es el índice rápido que lee cada sesión.

---

## Referencias

- Template: [`ADR-NNNN-template.md`](./ADR-NNNN-template.md)
- Doctrina AI de detección y autoría: `.claude/skills/agentic-qa-core/references/adr-doctrine.md`
- Ubicación en el mapa general: `.context/README.md` y root `CONTEXT.md`
- Estos registros cubren decisiones de **arquitectura de testing**: tanto el framework propio del boilerplate (KATA layers, fixtures, runner — owned by `/framework-development`) como su cableado a un proyecto bajo prueba específico (descubierto por `/project-discovery`).
