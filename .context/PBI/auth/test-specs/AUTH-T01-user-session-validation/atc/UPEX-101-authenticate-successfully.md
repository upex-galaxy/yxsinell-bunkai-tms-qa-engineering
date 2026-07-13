# ATC Spec: UPEX-101 — Authenticate Successfully

> **Ticket**: [UPEX-101](https://your-org.atlassian.net/browse/UPEX-101)
> **Component**: `AuthApi` (`tests/components/api/AuthApi.ts`)
> **Type**: API — Mutation
> **Parent Story**: UPEX-100 (Validate User Session Management)

---

## 1. Resumen del Test Case

| Field | Value |
|---|---|
| **Name** | Authenticate with valid credentials |
| **Objective** | Valida que POST /auth/login con credenciales válidas devuelve JWT token y la sesión queda usable |
| **Precondition** | Existe test user válido en el sistema (configurado en `.env`) |
| **Acceptance Criteria** | Login devuelve 200 con token válido; GET /auth/me posterior confirma sesión |

---

## 2. Contrato ATC

```typescript
/**
 * ATC: Authenticate with valid credentials - expects success (200)
 *
 * Complete flow:
 * 1. POST credentials to /auth/login (ACTION)
 * 2. GET /auth/me to confirm session is valid (VERIFICATION)
 * 3. Validate token response and user info
 *
 * Fixed assertions:
 * - Response status is 200
 * - Token has access_token, token_type "Bearer", expires_in > 0
 * - GET /auth/me returns 200 with matching email
 */
@atc('PROJ-101')
async authenticateSuccessfully(
  credentials: LoginPayload,
): Promise<[APIResponse, TokenResponse, LoginPayload]>
```

### Method Signature

| Aspect | Value |
|---|---|
| **Name** | `authenticateSuccessfully` |
| **Parameters** | `credentials: LoginPayload` (email + password) |
| **Return Type** | `Promise<[APIResponse, TokenResponse, LoginPayload]>` |

---

## 3A. Detalles API

### Endpoint

| Aspect | Value |
|---|---|
| **Method** | `POST` (action) + `GET` (verification) |
| **Path** | `POST /api/auth/login` → `GET /api/auth/me` |
| **Auth Required** | Login: No, Me: Yes (usa token del login) |
| **Content-Type** | `application/json` |

### Return Type

```typescript
// POST mutation — returns tuple with payload
Promise<[APIResponse, TokenResponse, LoginPayload]>
```

### OpenAPI Types

```typescript
import type { LoginPayload, TokenResponse, UserInfoResponse } from '@schemas/auth.types';

interface LoginPayload {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;    // "Bearer"
  expires_in: number;
}

interface UserInfoResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

### Request Body

```typescript
const credentials: LoginPayload = {
  email: config.testUser.email,
  password: config.testUser.password,
};
```

### Expected Response

```json
// POST /auth/login → 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}

// GET /auth/me → 200 (verification step)
{
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

---

## 4. División de Assertions

### Fixed Assertions (dentro del ATC)

| # | Assertion | Code |
|---|---|---|
| 1 | Login devuelve 200 | `expect(response.status()).toBe(200)` |
| 2 | Token presente | `expect(body.access_token).toBeDefined()` |
| 3 | Token type es Bearer | `expect(body.token_type).toBe('Bearer')` |
| 4 | Token tiene expiry | `expect(body.expires_in).toBeGreaterThan(0)` |
| 5 | Sesión válida (GET /me → 200) | `expect(meResponse.status()).toBe(200)` |
| 6 | User info presente | `expect(meBody.user).toBeDefined()` |
| 7 | Email coincide con credentials | `expect(meBody.user.email).toBe(credentials.email)` |

### Test-Level Assertions (en Test File)

| # | Assertion | Por qué es test-level |
|---|---|---|
| 1 | Formato string del token | Depende de detalles JWT implementation |
| 2 | Valor de user name | Cambia según test user |
| 3 | Reusabilidad de token | Específico de escenarios de re-authentication |

---

## 5. Code Template

```typescript
// In: tests/components/api/AuthApi.ts

/**
 * ATC: Authenticate with valid credentials - expects success (200)
 *
 * Complete flow:
 * 1. POST credentials to /auth/login (ACTION)
 * 2. GET /auth/me to confirm session is valid (VERIFICATION)
 * 3. Validate token response and user info
 */
@atc('PROJ-101')
async authenticateSuccessfully(
  credentials: LoginPayload,
): Promise<[APIResponse, TokenResponse, LoginPayload]> {
  // ACTION: POST login credentials
  const [response, body, sentPayload] = await this.apiPOST<TokenResponse, LoginPayload>(
    this.config.auth.loginEndpoint,
    credentials,
  );

  // Fixed assertions - validates successful authentication
  expect(response.status()).toBe(200);
  expect(body.access_token).toBeDefined();
  expect(body.token_type).toBe('Bearer');
  expect(body.expires_in).toBeGreaterThan(0);

  // Store token for subsequent requests
  this.setAuthToken(body.access_token);

  // VERIFICATION: Confirm the session is valid via GET /auth/me
  const [meResponse, meBody] = await this.getCurrentUser();
  expect(meResponse.status()).toBe(200);
  expect(meBody.user).toBeDefined();
  expect(meBody.user.email).toBe(credentials.email);

  return [response, body, sentPayload];
}
```

**Uso en test file:**

```typescript
// In: tests/integration/auth/user-session.test.ts

test('should be able to re-authenticate', async ({ api }) => {
  api.clearAuthToken();

  const credentials = {
    email: config.testUser.email,
    password: config.testUser.password,
  };

  const [response, tokenData] = await api.auth.authenticateSuccessfully(credentials);

  // Test-level assertions
  expect(response.status()).toBe(200);
  expect(tokenData.access_token).toBeDefined();
});
```

---

## 6. Equivalence Partitioning Check

| Input Variation | Expected Output | Same ATC? |
|---|---|---|
| Valid email + valid password | 200 + token + sesión creada | Yes — Base case |
| Different valid user | 200 + token + sesión creada | Yes — mismo output type, parameterize |
| Invalid email | 401 + error + sin sesión | No — `loginWithInvalidCredentials` (PROJ-102) |
| Valid email + wrong password | 401 + error + sin sesión | No — `loginWithInvalidCredentials` (PROJ-102) |

**Decision**: un ATC para todas las combinaciones de credenciales válidas (mismo output type: 200 + token). ATC separado (`loginWithInvalidCredentials`) para combinaciones inválidas (mismo output type: 401 + error).

---

## 7. Dependencies

### Precondition Steps

| Step | How | Component |
|---|---|---|
| None | Token auto-cargado desde api-state.json | ApiFixture |

### Required Components

| Component | Exists? | Action Needed |
|---|---|---|
| `AuthApi` | Yes | Method ya existe |
| `ApiFixture` | Yes | Ya registrado |

### Helper Dependencies

| Helper | Component | Used By |
|---|---|---|
| `getCurrentUser()` | `AuthApi` | Verification step interno en este ATC |

---

## 8. Checklist

- [x] Method name sigue convención `{verb}{Resource}{Scenario}`.
- [x] Parameters: 1 posicional (bajo límite max 2).
- [x] Return type coincide con patrón API mutation (tuple con payload).
- [x] Fixed assertions validan invariantes de éxito.
- [x] Test-level assertions documentadas para test file.
- [x] No duplica ATC existente (equivalence partitioning revisado).
- [x] OpenAPI types identificados (`LoginPayload`, `TokenResponse`).
- [x] Component placement determinado (`AuthApi` existente).
- [x] Precondition steps identificados (ninguno necesario).
- [x] ATC incluye step VERIFICATION (GET /auth/me confirma sesión).

---

## Cross-References

- **Test plan**: `.context/PBI/auth/test-specs/AUTH-T01-user-session-validation/implementation-plan.md`
- **Companion ATC**: UPEX-102 (`loginWithInvalidCredentials`) — mismo componente, negative path.
- **Component**: `tests/components/api/AuthApi.ts`
- **Guidelines**: skill `/test-automation` -- `references/test-design-principles.md`
