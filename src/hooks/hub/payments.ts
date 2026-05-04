import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * `hub.payments` — module on/off. Payment integrations and triggers follow
 * the canonical patterns from `hub.database`; extend via `injectEndpoints`
 * in your app when you wire the admin UI.
 */
export const hubPayments = (b: Builder) => {
  type HP = Norbix['hub']['payments'];

  return {
    enablePayments: b.mutation<
      Result<HP['enablePayments'] extends (...a: never[]) => unknown ? HP['enablePayments'] : never>,
      Arg<HP['enablePayments'] extends (...a: never[]) => unknown ? HP['enablePayments'] : never>
    >({
      query: (args) => (norbix) => (norbix.hub.payments as HP).enablePayments(args),
      invalidatesTags: ['Account', 'Projects', 'Payments'],
    }),

    disablePayments: b.mutation<
      Result<HP['disablePayments'] extends (...a: never[]) => unknown ? HP['disablePayments'] : never>,
      Arg<HP['disablePayments'] extends (...a: never[]) => unknown ? HP['disablePayments'] : never>
    >({
      query: (args) => (norbix) => (norbix.hub.payments as HP).disablePayments(args),
      invalidatesTags: ['Account', 'Projects', 'Payments'],
    }),
  } as const;
};
