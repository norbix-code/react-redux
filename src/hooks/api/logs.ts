import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type WriteLogs = Norbix['api']['logs']['writeLogs'];

/**
 * `api.logs` — your app's own log lines (API host), 1:1 with the core SDK.
 *
 * `writeLogs({ entries })` sends 1–100 lines; the answer `{ accepted }` comes
 * at once (the lines are queued). A 429 `CM-ERRORS-LOGGING-003` means the
 * project's per-minute quota is used up: the hook's `error` carries
 * `retryAfterSeconds` (the `Retry-After` header).
 *
 * Tags: invalidates `Logs`, so an open log list refetches.
 */
export const apiLogs = (b: Builder) => ({
  writeLogs: b.mutation<Result<WriteLogs>, Arg<WriteLogs>>({
    query: (args) => (norbix) => norbix.api.logs.writeLogs(args),
    invalidatesTags: ['Logs'],
  }),
});
