// AUTO-GENERATED — full coverage of `norbix.hub.resources` (1 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type ResolveResources = Norbix['hub']['resources']['resolveResources'];

/**
 * `hub.resources` — 1 endpoints, 1:1 with the core SDK.
 */
export const hubResources = (b: Builder) => ({
  resolveResources: b.mutation<Result<ResolveResources>, Arg<ResolveResources>>({
    query: (args) => (norbix) => norbix.hub.resources.resolveResources(args),
  }),
});
