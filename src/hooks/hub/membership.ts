// AUTO-GENERATED — full coverage of `norbix.hub.membership` (27 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DisableMembership = Norbix['hub']['membership']['disableMembership'];
type EnableMembership = Norbix['hub']['membership']['enableMembership'];
type DeleteMembershipTrigger = Norbix['hub']['membership']['deleteMembershipTrigger'];
type DisableMembershipTrigger = Norbix['hub']['membership']['disableMembershipTrigger'];
type EnableMembershipTrigger = Norbix['hub']['membership']['enableMembershipTrigger'];
type GetMembershipTrigger = Norbix['hub']['membership']['getMembershipTrigger'];
type GetMembershipTriggers = Norbix['hub']['membership']['getMembershipTriggers'];
type SaveMembershipTrigger = Norbix['hub']['membership']['saveMembershipTrigger'];
type CreateRole = Norbix['hub']['membership']['createRole'];
type DeleteRole = Norbix['hub']['membership']['deleteRole'];
type GetRole = Norbix['hub']['membership']['getRole'];
type GetRoles = Norbix['hub']['membership']['getRoles'];
type UpdateRolePolicies = Norbix['hub']['membership']['updateRolePolicies'];
type CreatePolicy = Norbix['hub']['membership']['createPolicy'];
type DeletePolicy = Norbix['hub']['membership']['deletePolicy'];
type GetPolicy = Norbix['hub']['membership']['getPolicy'];
type GetPolicies = Norbix['hub']['membership']['getPolicies'];
type UpdatePolicy = Norbix['hub']['membership']['updatePolicy'];
type GetPasskeySettings = Norbix['hub']['membership']['getPasskeySettings'];
type SavePasskeySettings = Norbix['hub']['membership']['savePasskeySettings'];
type DeleteMembershipIntegration = Norbix['hub']['membership']['deleteMembershipIntegration'];
type DisableMembershipIntegration = Norbix['hub']['membership']['disableMembershipIntegration'];
type EnableMembershipIntegration = Norbix['hub']['membership']['enableMembershipIntegration'];
type GetMembershipIntegration = Norbix['hub']['membership']['getMembershipIntegration'];
type GetMembershipIntegrations = Norbix['hub']['membership']['getMembershipIntegrations'];
type SaveMembershipIntegration = Norbix['hub']['membership']['saveMembershipIntegration'];
type SetMembershipIntegrationAsDefault = Norbix['hub']['membership']['setMembershipIntegrationAsDefault'];

/**
 * `hub.membership` — 27 endpoints, 1:1 with the core SDK.
 */
export const hubMembership = (b: Builder) => ({
  disableMembership: b.mutation<Result<DisableMembership>, Arg<DisableMembership>>({
    query: (args) => (norbix) => norbix.hub.membership.disableMembership(args),
    invalidatesTags: ['Membership'],
  }),

  enableMembership: b.mutation<Result<EnableMembership>, Arg<EnableMembership>>({
    query: (args) => (norbix) => norbix.hub.membership.enableMembership(args),
    invalidatesTags: ['Membership'],
  }),

  deleteMembershipTrigger: b.mutation<Result<DeleteMembershipTrigger>, Arg<DeleteMembershipTrigger>>({
    query: (args) => (norbix) => norbix.hub.membership.deleteMembershipTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  disableMembershipTrigger: b.mutation<Result<DisableMembershipTrigger>, Arg<DisableMembershipTrigger>>({
    query: (args) => (norbix) => norbix.hub.membership.disableMembershipTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  enableMembershipTrigger: b.mutation<Result<EnableMembershipTrigger>, Arg<EnableMembershipTrigger>>({
    query: (args) => (norbix) => norbix.hub.membership.enableMembershipTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  getMembershipTrigger: b.query<Result<GetMembershipTrigger>, Arg<GetMembershipTrigger>>({
    query: (args) => (norbix) => norbix.hub.membership.getMembershipTrigger(args),
    providesTags: ['Triggers'],
  }),

  getMembershipTriggers: b.query<Result<GetMembershipTriggers>, Arg<GetMembershipTriggers>>({
    query: (args) => (norbix) => norbix.hub.membership.getMembershipTriggers(args),
    providesTags: ['Triggers'],
  }),

  saveMembershipTrigger: b.mutation<Result<SaveMembershipTrigger>, Arg<SaveMembershipTrigger>>({
    query: (args) => (norbix) => norbix.hub.membership.saveMembershipTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  createRole: b.mutation<Result<CreateRole>, Arg<CreateRole>>({
    query: (args) => (norbix) => norbix.hub.membership.createRole(args),
    invalidatesTags: ['MembershipRoles'],
  }),

  deleteRole: b.mutation<Result<DeleteRole>, Arg<DeleteRole>>({
    query: (args) => (norbix) => norbix.hub.membership.deleteRole(args),
    invalidatesTags: ['MembershipRoles'],
  }),

  getRole: b.query<Result<GetRole>, Arg<GetRole>>({
    query: (args) => (norbix) => norbix.hub.membership.getRole(args),
    providesTags: ['MembershipRoles'],
  }),

  getRoles: b.query<Result<GetRoles>, Arg<GetRoles>>({
    query: (args) => (norbix) => norbix.hub.membership.getRoles(args),
    providesTags: ['MembershipRoles'],
  }),

  updateRolePolicies: b.mutation<Result<UpdateRolePolicies>, Arg<UpdateRolePolicies>>({
    query: (args) => (norbix) => norbix.hub.membership.updateRolePolicies(args),
    invalidatesTags: ['MembershipRoles'],
  }),

  createPolicy: b.mutation<Result<CreatePolicy>, Arg<CreatePolicy>>({
    query: (args) => (norbix) => norbix.hub.membership.createPolicy(args),
    invalidatesTags: ['MembershipPolicies'],
  }),

  deletePolicy: b.mutation<Result<DeletePolicy>, Arg<DeletePolicy>>({
    query: (args) => (norbix) => norbix.hub.membership.deletePolicy(args),
    invalidatesTags: ['MembershipPolicies'],
  }),

  getPolicy: b.query<Result<GetPolicy>, Arg<GetPolicy>>({
    query: (args) => (norbix) => norbix.hub.membership.getPolicy(args),
    providesTags: ['MembershipPolicies'],
  }),

  getPolicies: b.query<Result<GetPolicies>, Arg<GetPolicies>>({
    query: (args) => (norbix) => norbix.hub.membership.getPolicies(args),
    providesTags: ['MembershipPolicies'],
  }),

  updatePolicy: b.mutation<Result<UpdatePolicy>, Arg<UpdatePolicy>>({
    query: (args) => (norbix) => norbix.hub.membership.updatePolicy(args),
    invalidatesTags: ['MembershipPolicies'],
  }),

  getPasskeySettings: b.query<Result<GetPasskeySettings>, Arg<GetPasskeySettings>>({
    query: (args) => (norbix) => norbix.hub.membership.getPasskeySettings(args),
    providesTags: ['MembershipUsers'],
  }),

  savePasskeySettings: b.mutation<Result<SavePasskeySettings>, Arg<SavePasskeySettings>>({
    query: (args) => (norbix) => norbix.hub.membership.savePasskeySettings(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  deleteMembershipIntegration: b.mutation<Result<DeleteMembershipIntegration>, Arg<DeleteMembershipIntegration>>({
    query: (args) => (norbix) => norbix.hub.membership.deleteMembershipIntegration(args),
    invalidatesTags: ['MembershipIntegrations'],
  }),

  disableMembershipIntegration: b.mutation<Result<DisableMembershipIntegration>, Arg<DisableMembershipIntegration>>({
    query: (args) => (norbix) => norbix.hub.membership.disableMembershipIntegration(args),
    invalidatesTags: ['MembershipIntegrations'],
  }),

  enableMembershipIntegration: b.mutation<Result<EnableMembershipIntegration>, Arg<EnableMembershipIntegration>>({
    query: (args) => (norbix) => norbix.hub.membership.enableMembershipIntegration(args),
    invalidatesTags: ['MembershipIntegrations'],
  }),

  getMembershipIntegration: b.query<Result<GetMembershipIntegration>, Arg<GetMembershipIntegration>>({
    query: (args) => (norbix) => norbix.hub.membership.getMembershipIntegration(args),
    providesTags: ['MembershipIntegrations'],
  }),

  getMembershipIntegrations: b.query<Result<GetMembershipIntegrations>, Arg<GetMembershipIntegrations>>({
    query: (args) => (norbix) => norbix.hub.membership.getMembershipIntegrations(args),
    providesTags: ['MembershipIntegrations'],
  }),

  saveMembershipIntegration: b.mutation<Result<SaveMembershipIntegration>, Arg<SaveMembershipIntegration>>({
    query: (args) => (norbix) => norbix.hub.membership.saveMembershipIntegration(args),
    invalidatesTags: ['MembershipIntegrations'],
  }),

  setMembershipIntegrationAsDefault: b.mutation<Result<SetMembershipIntegrationAsDefault>, Arg<SetMembershipIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.membership.setMembershipIntegrationAsDefault(args),
    invalidatesTags: ['MembershipIntegrations'],
  }),
});
