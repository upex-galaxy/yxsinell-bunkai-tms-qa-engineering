import type { components, paths } from '@openapi';

export type Workspace = components['schemas']['Workspace'];

type MePath = paths['/api/v1/me']['get'];
export type MeResponse = MePath['responses']['200']['content']['application/json'];

type WorkspacesPath = paths['/api/v1/workspaces'];
export type ListWorkspacesResponse = WorkspacesPath['get']['responses']['200']['content']['application/json'];
export type CreateWorkspaceRequest = WorkspacesPath['post']['requestBody']['content']['application/json'];
export type CreateWorkspaceResponse = WorkspacesPath['post']['responses']['201']['content']['application/json'];

type ActiveWorkspacePath = paths['/api/v1/me/active-workspace']['post'];
export type SetActiveWorkspaceRequest = ActiveWorkspacePath['requestBody']['content']['application/json'];
export type SetActiveWorkspaceResponse = ActiveWorkspacePath['responses']['200']['content']['application/json'];
