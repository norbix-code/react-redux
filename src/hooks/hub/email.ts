// AUTO-GENERATED — full coverage of `norbix.hub.email` (1 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type OneClickUnsubscribe = Norbix['hub']['email']['oneClickUnsubscribe'];

/**
 * `hub.email` — 1 endpoints, 1:1 with the core SDK.
 */
export const hubEmail = (b: Builder) => ({
  oneClickUnsubscribe: b.mutation<Result<OneClickUnsubscribe>, Arg<OneClickUnsubscribe>>({
    query: (args) => (norbix) => norbix.hub.email.oneClickUnsubscribe(args),
  }),
});
