import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { Norbix } from 'norbix';

import { serializeNorbixError, type SerializedNorbixError } from './errors.js';

/**
 * Endpoint queries return a closure that takes the live Norbix client and
 * runs whatever SDK method the endpoint needs. This keeps the endpoints
 * fully typed end-to-end (the SDK's own DTOs flow through) and decouples
 * `createApi` from any specific instance of the client.
 *
 * @example
 * ```ts
 * endpoints: (b) => ({
 *   getUsers: b.query<UsersResponse, GetUsersArgs>({
 *     query: (args) => (norbix) => norbix.api.membership.getUsers(args),
 *   }),
 * })
 * ```
 */
export type NorbixCall<TResult> = (norbix: Norbix) => Promise<TResult>;

/** Function the user passes at `createNorbixApi` time to resolve the live client. */
export type GetNorbixClient = () => Norbix;

/**
 * Build the `baseQuery` RTK Query uses internally. The `getClient` argument
 * is called for every request so the caller can swap clients at runtime
 * (multi-tenant, SSR, test fixtures) without rebuilding the API slice.
 *
 * The base query never throws — it returns either `{ data }` or
 * `{ error: SerializedNorbixError }`, the shape RTK Query stores in state.
 */
export function createNorbixBaseQuery(
  getClient: GetNorbixClient,
): BaseQueryFn<NorbixCall<unknown>, unknown, SerializedNorbixError> {
  return async (call) => {
    let client: Norbix;
    try {
      client = getClient();
    } catch (err) {
      return { error: serializeNorbixError(err) };
    }
    if (!client) {
      return {
        error: {
          status: 0,
          code: 'NORBIX_NO_CLIENT',
          message: 'No Norbix client available. Did you forget <NorbixProvider>?',
          fieldErrors: [],
        },
      };
    }
    try {
      const data = await call(client);
      return { data };
    } catch (err) {
      return { error: serializeNorbixError(err) };
    }
  };
}
