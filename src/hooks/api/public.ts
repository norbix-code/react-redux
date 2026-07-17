// Full coverage of `norbix.api.public` (2 endpoints).
// Admin-Portal PUBLIC (unauthenticated) reads: project config + legal docs.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetPublicConfig = Norbix['api']['public']['getPublicProjectConfig'];
type GetPublicLegal = Norbix['api']['public']['getPublicProjectLegal'];

/**
 * `api.public` — unauthenticated, project-scoped reads used by the Admin
 * Portal before sign-in. Both are queries (cacheable GETs); they carry no
 * secrets and the backend gates the response by the project's expose flags.
 *
 * Cached under the `Config` tag — the project config rarely changes per
 * session, and a project settings change in Cloud would invalidate it.
 */
export const apiPublic = (b: Builder) => ({
  getPublicProjectConfig: b.query<Result<GetPublicConfig>, Arg<GetPublicConfig>>({
    query: (args) => (norbix) => norbix.api.public.getPublicProjectConfig(args),
    providesTags: [{ type: 'Config', id: 'PUBLIC' }],
  }),

  getPublicProjectLegal: b.query<Result<GetPublicLegal>, Arg<GetPublicLegal>>({
    query: (args) => (norbix) => norbix.api.public.getPublicProjectLegal(args),
    providesTags: (_res, _err, arg) => [
      { type: 'Config', id: `LEGAL:${arg?.kind ?? 'unknown'}` },
    ],
  }),
});
