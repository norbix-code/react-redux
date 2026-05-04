import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type LoginArg = Parameters<Norbix['login']>[0];
type LoginResult = Awaited<ReturnType<Norbix['login']>>;

type AuthenticateFn = Norbix['api']['auth']['authenticate'];

/**
 * Auth-related endpoints.
 *
 * - `login` calls `client.login(...)` directly — it mutates client state
 *   (stores the bearer token) so after a successful login you typically
 *   want to invalidate cached data. The mutation already invalidates the
 *   most-affected tags; for a hard reset call `dispatch(norbixApi.util.resetApiState())`.
 * - `authenticate` is the lower-level `api.auth.authenticate` endpoint and
 *   does not store the token on the client. Most apps use `login` instead.
 */
export const apiAuth = (b: Builder) => ({
  login: b.mutation<LoginResult, LoginArg>({
    query: (creds) => (norbix) => norbix.login(creds),
    invalidatesTags: [
      { type: 'MembershipUsers', id: 'LIST' },
      { type: 'AccountProfile', id: 'CURRENT' },
      { type: 'Account', id: 'Profile' },
    ],
  }),

  authenticate: b.mutation<Result<AuthenticateFn>, Arg<AuthenticateFn>>({
    query: (req) => (norbix) => norbix.api.auth.authenticate(req),
  }),

  logout: b.mutation<void, void>({
    queryFn: async (_arg, _api, _opts, baseQuery) => {
      const result = await baseQuery((norbix) => {
        norbix.logout();
        return Promise.resolve();
      });
      if (result.error) return { error: result.error };
      return { data: undefined };
    },
    invalidatesTags: [
      { type: 'MembershipUsers', id: 'LIST' },
      { type: 'AccountProfile', id: 'CURRENT' },
      { type: 'Account', id: 'Profile' },
      { type: 'DatabaseCollections' },
      { type: 'DatabaseSchemas' },
    ],
  }),
});
