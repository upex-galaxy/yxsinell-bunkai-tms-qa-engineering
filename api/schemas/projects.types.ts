import type { components, paths } from '@openapi';

export type Project = components['schemas']['Project'];
export type Module = components['schemas']['Module'];

type CreateProjectPath = paths['/api/v1/workspaces/{id}/projects']['post'];
export type CreateProjectRequest = CreateProjectPath['requestBody']['content']['application/json'];
export type CreateProjectResponse = CreateProjectPath['responses']['201']['content']['application/json'];

type CreateModulePath = paths['/api/v1/projects/{id}/modules']['post'];
export type CreateModuleRequest = CreateModulePath['requestBody']['content']['application/json'];
export type CreateModuleResponse = CreateModulePath['responses']['201']['content']['application/json'];
