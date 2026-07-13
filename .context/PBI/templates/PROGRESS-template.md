# {Module Name} - Tracker de Progreso de Automatización

> **Purpose**: Trackear progreso de implementación entre sesiones. Leer este archivo al inicio de cada sesión.
> **Last Updated**: {date}
> **Last Session**: {brief description of last session's work}

---

## Estado Actual

| Field | Value |
|---|---|
| **Current Phase** | Phase 1 - {Phase Name} (P0) |
| **Current Ticket** | {MODULE}-T01 (not started) |
| **Test Files Created** | 0 / {total tickets} |
| **TCs Automated** | 0 / {total TCs} |
| **Test Scenarios Automated** | 0 / {total TSs} |
| **Total Items** | 0 / {total} |
| **Blockers** | None |

---

## Progreso por Ticket

### Phase 1: {Phase Name} (P0)

| Ticket | Title | TCs | TSs | Status | Test File | Done | Notes |
|---|---|---|---|---|---|---|---|
| {MODULE}-T01 | {title} | {n} | {n} | `not-started` | — | 0/{total} | |
| {MODULE}-T02 | {title} | {n} | {n} | `not-started` | — | 0/{total} | |

### Phase 2: {Phase Name} (P1)

| Ticket | Title | TCs | TSs | Status | Test File | Done | Notes |
|---|---|---|---|---|---|---|---|
| {MODULE}-T03 | {title} | {n} | {n} | `not-started` | — | 0/{total} | |

### Phase 3: {Phase Name} (P2)

| Ticket | Title | TCs | TSs | Status | Test File | Done | Notes |
|---|---|---|---|---|---|---|---|
| {MODULE}-T04 | {title} | {n} | {n} | `not-started` | — | 0/{total} | |

---

## Leyenda de Status

- `not-started` — todavía no iniciado.
- `in-progress` — en trabajo.
- `blocked` — no se puede continuar (ver Notes).
- `review` — tests escritos, requiere verificación manual.
- `done` — tests escritos, pasando y verificados.

---

## Test Data Descubierta

> Completar esta sección al descubrir datos adecuados para testing.

| Purpose | Entity ID | Entity Name | Environment | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Shared Components Creados

> Trackear page objects, fixtures y helpers reutilizables creados durante este trabajo.

| Component | File Path | Used By | Description |
|---|---|---|---|
| — | — | — | — |

---

## Decisions & Learnings

> Registrar decisiones importantes, workarounds o descubrimientos hechos durante implementación.

| Date | Decision/Learning | Context |
|---|---|---|
| {date} | {decision} | {why this was decided} |

---

## Session Log

> Después de cada sesión, agregar una entrada breve con lo logrado.

| Date | Session | Tickets Touched | Summary |
|---|---|---|---|
| {date} | {type} | {tickets} | {what was done} |

---

## Cómo Actualizar Este Archivo

Después de cada sesión de trabajo:

1. Actualizar sección **Estado Actual** (current ticket, counts).
2. Actualizar fila del ticket en **Progreso por Ticket** (status, test file path, done count, notes).
3. Agregar test data descubierta en **Test Data Descubierta**.
4. Agregar shared components nuevos en **Shared Components Creados**.
5. Agregar decisiones importantes en **Decisions & Learnings**.
6. Agregar entrada de sesión en **Session Log**.
7. Actualizar **Last Updated** y **Last Session** en header.
