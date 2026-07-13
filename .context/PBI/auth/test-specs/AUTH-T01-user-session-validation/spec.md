# AUTH-T01: Validación de Sesión de Usuario

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Phase** | Phase 1 - Core Auth |
| **Items** | 4 TCs |
| **Dependencies** | None (foundation ticket) |
| **Requires** | Usuario de prueba válido en `.env`, UPEX Dojo API corriendo |

## Summary

Validar que la API y UI de autenticación gestionan sesiones correctamente: login con credenciales válidas crea una sesión válida, login con credenciales inválidas se rechaza, y endpoints autenticados aplican requerimientos de token.

## Preconditions

- UPEX Dojo API corriendo en `apiUrl` configurada.
- Credenciales de test user configuradas en `.env`.
- Para UI tests: browser navegado a `/login` vía `goto()`.

## Test Cases

### AUTH-001: Validar autenticación exitosa con credenciales válidas (API)

**Preconditions**: Existe un test user válido en el sistema.
**Action**: POST /auth/login con email y password válidos.
**Expected Output**:
- Response status 200.
- Token tiene `access_token`, `token_type` "Bearer", `expires_in` > 0.
- GET /auth/me devuelve 200 con email coincidente (sesión válida).

```gherkin
Scenario: AUTH-001 - Validate successful authentication when valid credentials are provided
  Given a valid test user exists in the system
  When the user sends POST /auth/login with valid credentials
  Then the response status is 200
  And the response contains a valid JWT token
  And GET /auth/me confirms the session is valid with matching user email
```

### AUTH-002: Validar rechazo de autenticación con credenciales inválidas (API)

**Preconditions**: No hay sesión activa.
**Action**: POST /auth/login con email inválido o password incorrecto.
**Expected Output**:
- Response status 401.
- Response contiene mensaje de error.
- GET /auth/me devuelve 401 (no se creó sesión).

```gherkin
Scenario: AUTH-002 - Validate authentication rejection when invalid credentials are provided
  Given no active user session exists
  When the user sends POST /auth/login with invalid credentials
  Then the response status is 401
  And the response contains an error message
  And GET /auth/me confirms no session was created
```

### AUTH-003: Validar login exitoso vía UI con credenciales válidas

**Preconditions**: Browser navegado a `/login`; existe test user válido.
**Action**: Completar formulario login con credenciales válidas y submit.
**Expected Output**:
- Page redirige fuera de `/login`.

```gherkin
Scenario: AUTH-003 - Validate successful login when valid credentials are submitted via UI
  Given the user is on the login page
  When the user fills in valid credentials and submits the form
  Then the page redirects away from /login
```

### AUTH-004: Validar enforcement de endpoint protegido sin token (API)

**Preconditions**: Auth token limpiado.
**Action**: GET /auth/me sin token.
**Expected Output**:
- Response status 401.
- Response no es ok.

```gherkin
Scenario: AUTH-004 - Validate protected endpoint enforcement when no token is provided
  Given the auth token has been cleared
  When the user sends GET /auth/me without authentication
  Then the response status is 401
  And the response is not ok
```

## Acceptance Criteria

- [ ] Los 4 TCs automatizados y pasando.
- [ ] API ATCs siguen patrón ACTION + VERIFICATION.
- [ ] UI ATC usa locators `data-testid`.
- [ ] Sin credenciales hardcodeadas en test code (usar config).
- [ ] Test isolation: cada test recibe fixture state fresco.
