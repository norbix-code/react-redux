// AUTO-GENERATED — full coverage of `norbix.hub.apikeys` (2 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetHubApiKeys = Norbix['hub']['apikeys']['getApiKeys'];
type RegenerateHubApiKeys = Norbix['hub']['apikeys']['regenerateApiKeys'];

/**
 * `hub.apikeys` — 2 endpoints, 1:1 with the core SDK.
 */
export const hubApikeys = (b: Builder) => ({
  getHubApiKeys: b.query<Result<GetHubApiKeys>, Arg<GetHubApiKeys>>({
    query: (args) => (norbix) => norbix.hub.apikeys.getApiKeys(args),
    providesTags: ['ApiKey'],
  }),

  regenerateHubApiKeys: b.mutation<Result<RegenerateHubApiKeys>, Arg<RegenerateHubApiKeys>>({
    query: (args) => (norbix) => norbix.hub.apikeys.regenerateApiKeys(args),
    invalidatesTags: ['ApiKey'],
  }),
});
