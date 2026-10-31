import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type LoginArg = Parameters<Norbix['login']>[0];
type LoginResult = Awaited<ReturnType<Norbix['login']>>;

type AuthenticateFn = Norbix['api']['auth']['authenticate'];
type BrowserSignInFn = Norbix['api']['auth']['browserSignIn'];

/**
 * Auth-related endpoints.
 *
 * - `login` calls `client.login(...)` directly — it mutates client state
 *   (stores the bearer token) so after a successful login you typically
 *   want to invalidate cached data. The mutation already invalidates the
 *   most-affected tags; for a hard reset call `dispatch(norbixApi.util.resetApiState())`.
 * - `authenticate` is the lower-level `api.auth.authenticate` endpoint and
 *   does not store the token on the client. Most apps use `login` instead.
 * - `signIn` and `signOut` are for a client with `auth: { type: 'browserSession' }`.
 *   `signIn` calls `api.auth.browserSignIn`, so no session id reaches the Redux
 *   store. `signOut` ends the session on the server; `logout` only clears the
 *   client's local token.
 */
const SIGNED_IN_TAGS = [
  { type: 'MembershipUsers', id: 'LIST' },
  { type: 'AccountProfile', id: 'CURRENT' },
  { type: 'Account', id: 'Profile' },
] as const;

const SIGNED_OUT_TAGS = [
  ...SIGNED_IN_TAGS,
  { type: 'DatabaseCollections' },
  { type: 'DatabaseSchemas' },
] as const;

export const apiAuth = (b: Builder) => ({
  login: b.mutation<LoginResult, LoginArg>({
    query: (creds) => (norbix) => norbix.login(creds),
    invalidatesTags: SIGNED_IN_TAGS,
  }),

  authenticate: b.mutation<Result<AuthenticateFn>, Arg<AuthenticateFn>>({
    query: (req) => (norbix) => norbix.api.auth.authenticate(req),
  }),

  signIn: b.mutation<Awaited<ReturnType<BrowserSignInFn>>, Parameters<BrowserSignInFn>[0]>({
    query: (credentials) => (norbix) => norbix.api.auth.browserSignIn(credentials),
    invalidatesTags: SIGNED_IN_TAGS,
  }),

  signOut: b.mutation<void, void>({
    query: () => (norbix) => norbix.api.auth.signOut(),
    invalidatesTags: SIGNED_OUT_TAGS,
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
    invalidatesTags: SIGNED_OUT_TAGS,
  }),
});
