# Auth - Plan de Testing

> **Module**: Authentication (`/auth/*`)
> **Total Tickets**: 1
> **Total Items**: 4 TCs (2 API + 2 UI)
> **Created**: 2026-03-19

---

## 1. Resumen Ejecutivo

El módulo de autenticación es la puerta de entrada a toda la aplicación. Todo flujo de usuario depende de una sesión válida, por eso auth es el módulo de mayor prioridad para cobertura de testing.

**Riesgos clave:**

- Credenciales inválidas creando sesiones silenciosamente (brecha de seguridad).
- Expiración de token no aplicada (sesiones stale).
- Endpoints protegidos accesibles sin auth (authorization bypass).

---

## 2. Overview del Módulo

| Aspect | Value |
|---|---|
| **Domain** | Authentication & Session Management |
| **Primary Actors** | Todos los usuarios (login es universal) |
| **API Endpoints** | `POST /api/auth/login`, `GET /api/auth/me` |
| **UI Pages** | `/login` (form público) |

---

## 3. Data Flow & API Endpoints

```
Login Flow (API):
POST /api/auth/login { email, password }
  → 200: { access_token, token_type, expires_in }
  → 401: { error }

Session Verification:
GET /api/auth/me (requires Bearer token)
  → 200: { user: { id, email, name } }
  → 401: unauthorized
```

```
Login Flow (UI):
/login page → fill form → submit
  → Success: redirect away from /login
  → Failure: error message, stay on /login
```

---

## 4. Estrategia de Test Data

| Data | Source | Notes |
|---|---|---|
| Credenciales válidas | `config.testUser` desde `.env` | Usuario de prueba preexistente |
| Credenciales inválidas | Inline en test | Valores malos hardcodeados |
| Auth token | `api-state.json` desde setup project | Auto-cargado por `ApiFixture` |

---

## 5. Referencia de Selectores Clave

| Element | Selector | Page |
|---|---|---|
| Email input | `[data-testid="login-email-input"]` | `/login` |
| Password input | `[data-testid="login-password-input"]` | `/login` |
| Submit button | `[data-testid="login-submit-button"]` | `/login` |

---

## Ver También

- Test specs: directorio `test-specs/` en esta carpeta.
- Component (API): `tests/components/api/AuthApi.ts`
- Component (UI): `tests/components/ui/LoginPage.ts`
- Test file (integration): `tests/integration/auth/user-session.test.ts`
- Test file (e2e): `tests/e2e/dashboard/dashboard.test.ts`
