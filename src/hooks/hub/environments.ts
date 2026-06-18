// AUTO-GENERATED — full coverage of `norbix.hub.environments` (3 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type ListEnvironments = Norbix['hub']['environments']['list'];
type CreateEnvironment = Norbix['hub']['environments']['create'];
type DeleteEnvironment = Norbix['hub']['environments']['delete'];

/**
 * `hub.environments` — project environments (list / create / delete), 1:1 with
 * the core SDK. These endpoints manage the *set* of environments. To make the
 * other hooks operate *inside* a given environment, set `env` on the underlying
 * Norbix client (`norbix.setEnv('TEST')`); every request then sends the
 * `norbix-env` header automatically.
 */
export const hubEnvironments = (b: Builder) => ({
  listEnvironments: b.query<Result<ListEnvironments>, Arg<ListEnvironments>>({
    query: (args) => (norbix) => norbix.hub.environments.list(args),
    providesTags: ['Environments'],
  }),

  createEnvironment: b.mutation<Result<CreateEnvironment>, Arg<CreateEnvironment>>({
    query: (args) => (norbix) => norbix.hub.environments.create(args),
    // Creating an env changes the available set and seeds a DB integration.
    invalidatesTags: ['Environments', 'Projects', 'DatabaseIntegrations'],
  }),

  deleteEnvironment: b.mutation<Result<DeleteEnvironment>, Arg<DeleteEnvironment>>({
    query: (args) => (norbix) => norbix.hub.environments.delete(args),
    // Deleting cascades integrations across modules in that env.
    invalidatesTags: ['Environments', 'Projects', 'DatabaseIntegrations'],
  }),
});
