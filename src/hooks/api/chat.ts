// AUTO-GENERATED — full coverage of `norbix.api.chat` (1 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type AskChat = Norbix['api']['chat']['askChat'];

/**
 * `api.chat` — 1 endpoints, 1:1 with the core SDK.
 */
export const apiChat = (b: Builder) => ({
  askChat: b.mutation<Result<AskChat>, Arg<AskChat>>({
    query: (args) => (norbix) => norbix.api.chat.askChat(args),
  }),
});
