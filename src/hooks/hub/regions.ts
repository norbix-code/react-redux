// AUTO-GENERATED — full coverage of `norbix.hub.regions` (2 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type ListRegions = Norbix['hub']['regions']['list'];
type UpdateProjectRegions = Norbix['hub']['regions']['updateProjectRegions'];

/**
 * `hub.regions` — Norbix regions (list / update project regions), 1:1 with
 * the core SDK. These endpoints manage the *set* of regions a project spans
 * (one primary + any additional). To make the other hooks operate *against*
 * a given region, set `region` on the underlying Norbix client
 * (`norbix.setRegion('nb-eu-germany')`); every request then sends the
 * `nb-region` header automatically.
 *
 * NOTE: `hub.account` carries `getAccountRegions` / `updateProjectRegions`
 * aliases for the same wire endpoints. This factory is spread *after*
 * `hubAccount` in `buildEndpoints`, so the `updateProjectRegions` endpoint
 * below (which also invalidates the `Regions` tag) is the one that ships.
 */
export const hubRegions = (b: Builder) => ({
  listRegions: b.query<Result<ListRegions>, Arg<ListRegions>>({
    query: (args) => (norbix) => norbix.hub.regions.list(args),
    providesTags: ['Regions'],
  }),

  updateProjectRegions: b.mutation<Result<UpdateProjectRegions>, Arg<UpdateProjectRegions>>({
    query: (args) => (norbix) => norbix.hub.regions.updateProjectRegions(args),
    // Changing the regions a project spans updates the project DTO
    // (`primaryRegion` / `additionalRegions`).
    invalidatesTags: ['Regions', 'Projects'],
  }),
});
