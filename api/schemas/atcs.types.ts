import type { components, paths } from '@openapi';

export type Atc = components['schemas']['Atc'];

type CreateAtcPath = paths['/api/v1/atcs']['post'];
export type CreateAtcRequest = CreateAtcPath['requestBody']['content']['application/json'];
export type CreateAtcResponse = CreateAtcPath['responses']['201']['content']['application/json'];

type SearchAtcsPath = paths['/api/v1/atcs/search']['get'];
export type SearchAtcsResponse = SearchAtcsPath['responses']['200']['content']['application/json'];
