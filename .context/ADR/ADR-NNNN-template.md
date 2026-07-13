# ADR-NNNN — <Título corto de decisión>

- **Status:** Proposed <!-- Proposed | Accepted | Superseded by ADR-MMMM | Deprecated -->
- **Date:** YYYY-MM-DD <!-- fecha de decisión / último cambio de estado -->
- **Deciders:** <nombres o roles — quién es dueño de esta decisión (QA architect / lead / framework owner)>
- **Tags:** <comma-separated, e.g. test-runner, fixtures, isolation, auth-in-tests, ci>
- **Supersedes:** — <!-- ADR-MMMM si reemplaza una decisión anterior, si no — -->
- **Superseded by:** — <!-- ADR-MMMM si una decisión nueva reemplaza esta, si no — -->

---

## Context

¿Qué fuerza una decisión de arquitectura de testing acá? Describir el problema, constraints (tooling, CI, flake, equipo, tiempo) y assumptions. Decir qué es verdad _ahora_, con suficiente detalle para que alguien dentro de seis meses entienda la presión sin haber estado en la reunión. Citar evidencia donde exista (flaky-run data, CI timing, vendor limit, SRS requirement, incident).

Contextos comunes: elección test-runner/framework, test-isolation & parallelization model, fixture/test-data strategy, auth-in-tests approach, selector/`data-testid` contract, exploratory-vs-scripted boundary, reporting/CI sharding, flake-retry & timeout policy.

## Decision

La opción elegida, escrita como oración activa y clara: “We will …”. Debe ser lo bastante específica para que alguien pueda saber si un cambio futuro la viola. Si la decisión introduce un invariante que todo test debe respetar, declararlo explícitamente.

## Consequences

Qué pasa a ser cierto cuando esto entra en vigor: lo bueno, lo malo y lo neutral. Esta es la sección que más le importa al lector futuro.

- **Positive:** qué se vuelve más fácil, rápido o menos flaky.
- **Negative / trade-offs:** qué se vuelve más difícil o qué se resigna (runtime cost, setup complexity, lock-in). Un ADR sin negativos suele estar poco examinado.
- **Neutral / follow-ups:** nuevas constraints, cosas a revisar, trabajo que desbloquea o bloquea.

## Alternatives considered

Opciones serias que **no** elegimos y por qué. Un bloque corto por alternativa: suficiente para que nadie repro-ponga una opción rechazada sin información nueva.

- **<Alternative A>** — por qué se rechazó.
- **<Alternative B>** — por qué se rechazó.

## References

- Links a SRS / infrastructure docs, tickets, flaky-run reports, CI dashboards, ADRs previos o referencias externas que informaron la decisión.

<!--
Notas de autoría (borrar este comentario en el ADR real):
- Filename: ADR-<NNNN>-<kebab-slug>.md  (4 dígitos, nunca reutilizar).
- Agregar una fila a .context/ADR/README.md → Index después de crear este archivo.
- Append-only: una vez Accepted, no reescribir Decision/Consequences. Para cambiar rumbo,
  escribir un ADR NUEVO que Supersedes este y cambiar Status + Superseded-by acá.
- Solo decisiones ADR-worthy van acá: architectural Y hard to reverse. Trade-offs locales
  de ticket quedan en acceptance-test-planning.md / automation plan.
  Ver .context/ADR/README.md.
-->
