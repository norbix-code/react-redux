// Public surface of @norbix/react-redux.
//
// Most apps need only:
//   - createNorbixApi  -> build the RTK Query slice
//   - NorbixProvider    -> mount the SDK client in React tree
//   - useNorbix         -> grab the SDK client from any component
//
// Hooks (`useGetUsersQuery`, `useInsertOneMutation`, ...) are read off the
// API instance returned by `createNorbixApi`.

export { createNorbixApi, type NorbixApi } from './createNorbixApi.js';
export { NorbixProvider, useNorbix, useOptionalNorbix } from './provider.js';
export type { NorbixProviderProps } from './provider.js';

// Lower-level building blocks for advanced users (custom endpoint sets,
// tests, alternative API slices).
export { createNorbixBaseQuery } from './baseQuery.js';
export type { NorbixCall, GetNorbixClient } from './baseQuery.js';
export { serializeNorbixError } from './errors.js';
export type { SerializedNorbixError } from './errors.js';

// Endpoint helpers for app-side `injectEndpoints` patterns.
export { buildIntegrationsEndpoints } from './helpers/integrations.js';
export type {
  BuildIntegrationsOptions,
  IntegrationEndpointKeys,
} from './helpers/integrations.js';

// Re-export for app-side endpoint factories that want to enforce the same
// tag taxonomy as the canonical hooks.
export type { AllTags, Builder } from './hooks/index.js';
