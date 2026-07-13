import type { components, paths } from '@openapi';

export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];

type CheckEmailPath = paths['/api/v1/auth/check-email']['post'];
export type CheckEmailPayload = CheckEmailPath['requestBody']['content']['application/json'];
export type CheckEmailResponse = CheckEmailPath['responses']['200']['content']['application/json'];

type SigninPath = paths['/api/v1/auth/signin']['post'];
export type LoginPayload = SigninPath['requestBody']['content']['application/json'];
export type TokenResponse = SigninPath['responses']['200']['content']['application/json'];
export type SigninResponse = TokenResponse;
export type AuthErrorResponse = ErrorEnvelope;

type MePath = paths['/api/v1/me']['get'];
export type UserInfoResponse = MePath['responses']['200']['content']['application/json'];

export function getApiBearerToken(response: TokenResponse): string {
  return response.pat.token;
}

export function getApiTokenType(_response: TokenResponse): string {
  return 'Bearer';
}

export function getApiTokenExpiresIn(response: TokenResponse): number {
  if (!response.pat.expires_at) {
    return 86_400;
  }
  const expiresAt = Date.parse(response.pat.expires_at);
  if (Number.isNaN(expiresAt)) {
    return 86_400;
  }
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}
