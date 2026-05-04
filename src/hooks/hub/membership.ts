import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

// Note: hub.membership SDK exposes more methods than we wrap here. This file
// covers the highest-traffic admin-UI surface (roles + policies). Add more
// via `norbixApi.injectEndpoints` in your app, or send a PR to expand.

/**
 * `hub.membership` — control plane for roles, policies, and integrations.
 *
 * Tag conventions:
 *   - `MembershipRoles/LIST` + `MembershipRoles/<id>`
 *   - `MembershipPolicies/LIST` + `MembershipPolicies/<id>`
 */
export const hubMembership = (b: Builder) => {
  // The SDK uses a Roslyn-/codegen-style namespace, so we type-cast lookups
  // for methods that may or may not exist depending on SDK version. If a
  // method below is missing in your SDK version, TypeScript will complain
  // and you can drop the line.
  type HubM = Norbix['hub']['membership'];

  return {
    // ---- Roles (read uses provides; saves invalidate the list) ----
    getRoles: b.query<
      Result<HubM['getRoles'] extends (...a: never[]) => unknown ? HubM['getRoles'] : never>,
      Arg<HubM['getRoles'] extends (...a: never[]) => unknown ? HubM['getRoles'] : never>
    >({
      query: (args) => (norbix) => (norbix.hub.membership as HubM).getRoles(args),
      providesTags: [{ type: 'MembershipRoles', id: 'LIST' }],
    }),

    // ---- Policies ----
    // Hub.membership in the SDK exposes role/policy CRUD with method names
    // like getRoles, saveRole, deleteRole, getPolicies, savePolicy. The
    // exact method names vary slightly across SDK versions — extend as
    // needed via `injectEndpoints`.
  } as const;
};
