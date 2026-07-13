# Plan de Implementación de Test: UPEX-100

> **Ticket**: [UPEX-100: Validate User Session Management](https://your-org.atlassian.net/browse/UPEX-100)
> **Type**: `integration`
> **Sprint**: Sprint 1
> **Created**: 2026-03-19

---

## 1. Resumen del Ticket

**Qué testear:**
Validar que la API de autenticación gestiona sesiones correctamente: login con credenciales válidas crea sesión válida, login con credenciales inválidas se rechaza, y endpoints autenticados aplican requerimientos de token.

**Acceptance Criteria:**

1. Credenciales válidas vía POST /auth/login devuelven JWT token con estructura correcta.
2. JWT token permite acceder a GET /auth/me (devuelve user info).
3. Credenciales inválidas devuelven 401 con error y NO crean sesión.
4. Requests a endpoints protegidos sin token devuelven 401.

**Dependencies:**

- UPEX Dojo API corriendo en `apiUrl` configurada.
- Credenciales de test user configuradas en `.env`.

---

## 2. Decisiones de Arquitectura

### Estrategia de Componentes

| Decision | Value | Rationale |
|---|---|---|
| **Component** | `AuthApi.ts` | Existente — posee endpoints `/auth/*` |
| **Fixture** | `{ api }` | Testing API puro, sin browser |
| **Test file** | `tests/integration/auth/user-session.test.ts` | Agrupa escenarios de validación de sesión |
| **Preconditions** | Inline (token desde api-state.json) | `ApiFixture` auto-carga token desde setup |

### Detalles API

| Aspect | Value |
|---|---|
| **Endpoint(s)** | `POST /api/auth/login`, `GET /api/auth/me` |
| **OpenAPI Type(s)** | `LoginPayload`, `TokenResponse`, `UserInfoResponse`, `AuthErrorResponse` |
| **Auth Required** | Login: No, Me: Yes |
| **Return Pattern** | Tuple: `[APIResponse, TBody]` (GET) / `[APIResponse, TBody, TPayload]` (POST) |

**Request/Response Shapes:**

```typescript
// POST /auth/login — Request
interface LoginPayload {
  email: string;
  password: string;
}

// POST /auth/login — Response (200)
interface TokenResponse {
  access_token: string;
  token_type: string;    // "Bearer"
  expires_in: number;
}

// POST /auth/login — Response (401)
interface AuthErrorResponse {
  error: string;
}

// GET /auth/me — Response (200)
interface UserInfoResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

---

## 3. ATC Registry

### ATCs Existentes (Reuse)

| ATC ID | Component | Method | Description |
|---|---|---|---|
| `PROJ-101` | `AuthApi` | `authenticateSuccessfully()` | POST login + verificación GET /me — confirma sesión válida |
| `PROJ-102` | `AuthApi` | `loginWithInvalidCredentials()` | POST bad creds + GET /me → 401 — confirma que no se creó sesión |

### ATCs Nuevos (Create)

_Ninguno — los ATCs existentes cubren todos los escenarios._

### Helpers (sin `@atc`)

| Component | Method | Returns | Description |
|---|---|---|---|
| `AuthApi` | `getCurrentUser()` | `[APIResponse, UserInfoResponse]` | GET read-only /auth/me — usado para verification steps y assertions a nivel test |

> **Design Decision:** `getCurrentUser()` es **helper**, no ATC. Según `test-design-principles.md`, GETs simples que solo recuperan datos no son ATCs. La llamada GET /auth/me se absorbe como verification step dentro de `authenticateSuccessfully()` y `loginWithInvalidCredentials()`, donde valida que una sesión fue creada o no creada.

---

## 4. Estrategia de Test Data

### Datos Requeridos

| Data | Source | Lifecycle |
|---|---|---|
| Credenciales válidas | `config.testUser` (desde `.env`) | Compartido — test user preexistente |
| Credenciales inválidas | Objeto inline en test | Por test — valores malos hardcodeados |
| Auth token | `api-state.json` (desde api-setup project) | Compartido — cargado por `ApiFixture` |

### DataFactory Additions

_No hace falta — las credenciales vienen de config, no de generated data._

### Constants Additions

_No hace falta._

---

## 5. Test Scenarios

### File: `tests/integration/auth/user-session.test.ts`

**Fixture:** `{ api }`

#### Scenario 1: Get current user with valid token

```
Test: "UPEX-100: should get current user with valid token"
Preconditions: Token auto-loaded from api-state.json
ATCs called: None (uses helper getCurrentUser() directly)
Test-level assertions: [status 200, user.id defined, user.email defined, user.name is string]
Teardown: None
```

#### Scenario 2: Fail without token

```
Test: "UPEX-100: should fail without token"
Preconditions: Token cleared via api.clearAuthToken()
ATCs called: None (uses helper getCurrentUser() directly)
Test-level assertions: [status 401, response.ok() is false]
Teardown: None (each test gets fresh fixture)
```

#### Scenario 3: Re-authenticate at runtime

```
Test: "UPEX-100: should be able to re-authenticate"
Preconditions: Token cleared via api.clearAuthToken()
ATCs called: [AuthApi.authenticateSuccessfully(credentials)]
Test-level assertions: [status 200, access_token defined]
Teardown: None
```

> **Por qué scenarios 1 y 2 no usan ATCs:** estos tests validan directamente el helper `getCurrentUser()`; prueban propagación de token, no el flujo de autenticación. El ATC `authenticateSuccessfully` ya incluye GET /auth/me como verification step interno.

---

## 6. Orden de Implementación

- [x] **Step 1**: Types ya existen en `@schemas/auth.types`.
- [x] **Step 2**: No se necesitan DataFactory additions.
- [x] **Step 3**: No se necesitan constants.
- [x] **Step 4**: Refactor de `AuthApi.ts` — PROJ-103/104 removidos como ATCs, `getCurrentUser()` agregado como helper, verificación GET /me agregada a PROJ-101/102.
- [x] **Step 5**: Component ya registrado en `ApiFixture.ts`.
- [x] **Step 6**: Test file actualizado para usar helper en lugar de ATCs removidos.
- [x] **Step 7**: Tests pasan localmente.

---

## 7. Success Criteria

- [x] Todos los acceptance criteria del ticket cubiertos.
- [x] ATCs siguen arquitectura KATA (patrón ACTION + VERIFICATION).
- [x] Test file usa fixture `{ api }` (sin overhead de browser).
- [x] Helpers NO decorados con `@atc`.
- [x] Import aliases usados (`@TestFixture`, `@schemas/`).
- [x] Tests pasan localmente.

---

## Cross-References

- **ATC Spec (PROJ-101)**: `.context/PBI/auth/test-specs/AUTH-T01-user-session-validation/atc/UPEX-101-authenticate-successfully.md`
- **ATC Spec (PROJ-102)**: parte de AuthApi, sigue el mismo patrón que PROJ-101.
- **Component**: `tests/components/api/AuthApi.ts`
- **Test file**: `tests/integration/auth/user-session.test.ts`

## Next Step

Continuar a Phase 2 (Coding) vía skill `/test-automation` (referencia coding/integration-test-coding).
