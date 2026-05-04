import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * `hub.logs` — module on/off plus the audit-by-correlation-id read.
 * Logging integrations follow the canonical integrations pattern; copy
 * `hub.database` integrations into `injectEndpoints` if your app needs them.
 */
export const hubLogs = (b: Builder) => {
  type HL = Norbix['hub']['logs'];

  return {
    // The SDK exposes module enable/disable as `enableLogging` / `disableLogging`
    // in some versions. Extend or rename via `injectEndpoints` if your SDK
    // uses different method names.
    enableLogging: b.mutation<
      Result<HL['enableLogging'] extends (...a: never[]) => unknown ? HL['enableLogging'] : never>,
      Arg<HL['enableLogging'] extends (...a: never[]) => unknown ? HL['enableLogging'] : never>
    >({
      query: (args) => (norbix) => (norbix.hub.logs as HL).enableLogging(args),
      invalidatesTags: ['Account', 'Projects', 'Logs'],
    }),

    disableLogging: b.mutation<
      Result<HL['disableLogging'] extends (...a: never[]) => unknown ? HL['disableLogging'] : never>,
      Arg<HL['disableLogging'] extends (...a: never[]) => unknown ? HL['disableLogging'] : never>
    >({
      query: (args) => (norbix) => (norbix.hub.logs as HL).disableLogging(args),
      invalidatesTags: ['Account', 'Projects', 'Logs'],
    }),
  } as const;
};
