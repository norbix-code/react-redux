import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetApiKeys = Norbix['api']['apikeys']['getApiKeys'];
type RegenerateApiKeys = Norbix['api']['apikeys']['regenerateApiKeys'];

/**
 * `api.apikeys` — list and rotate the per-environment API keys for the
 * project. Mutating endpoints invalidate the list so the UI auto-refreshes.
 */
export const apiApikeys = (b: Builder) => ({
  getApiKeys: b.query<Result<GetApiKeys>, Arg<GetApiKeys>>({
    query: (args) => (norbix) => norbix.api.apikeys.getApiKeys(args),
    providesTags: [{ type: 'ApiKey', id: 'LIST' }],
  }),

  regenerateApiKeys: b.mutation<Result<RegenerateApiKeys>, Arg<RegenerateApiKeys>>({
    query: (args) => (norbix) => norbix.api.apikeys.regenerateApiKeys(args),
    invalidatesTags: [{ type: 'ApiKey', id: 'LIST' }],
  }),
});
