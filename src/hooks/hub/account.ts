import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetAccountProfile = Norbix['hub']['account']['getAccountProfile'];
type UpdateAccountProfile = Norbix['hub']['account']['updateAccountProfile'];
type GetAccountStatus = Norbix['hub']['account']['getAccountStatus'];
type GetProjects = Norbix['hub']['account']['getProjects'];
type GetProject = Norbix['hub']['account']['getProject'];
type CreateProject = Norbix['hub']['account']['createProject'];
type DeleteProject = Norbix['hub']['account']['deleteProject'];
type GetAccountRegions = Norbix['hub']['account']['getAccountRegions'];
type CreateStripeCheckoutSession = Norbix['hub']['account']['createStripeCheckoutSession'];
type GetStripeBillingPortalUrl = Norbix['hub']['account']['getStripeBillingPortalUrl'];
type ResendAccountVerificationToken = Norbix['hub']['account']['resendAccountVerificationToken'];
type VerifyAccount = Norbix['hub']['account']['verifyAccount'];
type CreateTeamMemberFromInvitation = Norbix['hub']['account']['createTeamMemberFromInvitation'];

/**
 * `hub.account` — control-plane endpoints for the account profile, billing,
 * projects, team. Use this from admin UIs and onboarding flows; runtime app
 * code typically does not touch the Hub surface.
 *
 * Tag conventions (mirror the Norbix Cloud admin UI):
 *   - `Account/Profile`           — current account profile
 *   - `Account/Info`              — account status / verification
 *   - `Account/Licenses`          — license list
 *   - `Projects/LIST`             — project list
 *   - `Projects/<id>`             — single project
 *   - `Billing`                   — Stripe-related state
 */
export const hubAccount = (b: Builder) => ({
  // ---- Profile ----
  getAccountProfile: b.query<Result<GetAccountProfile>, Arg<GetAccountProfile>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountProfile(args),
    providesTags: [{ type: 'Account', id: 'Profile' }],
  }),

  getAccountStatus: b.query<Result<GetAccountStatus>, Arg<GetAccountStatus>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountStatus(args),
    providesTags: [{ type: 'Account', id: 'Info' }],
  }),

  updateAccountProfile: b.mutation<Result<UpdateAccountProfile>, Arg<UpdateAccountProfile>>({
    query: (args) => (norbix) => norbix.hub.account.updateAccountProfile(args),
    invalidatesTags: [{ type: 'Account', id: 'Profile' }],
  }),

  // ---- Verification ----
  resendAccountVerificationToken: b.mutation<
    Result<ResendAccountVerificationToken>,
    Arg<ResendAccountVerificationToken>
  >({
    query: (args) => (norbix) => norbix.hub.account.resendAccountVerificationToken(args),
  }),

  verifyAccount: b.mutation<Result<VerifyAccount>, Arg<VerifyAccount>>({
    query: (args) => (norbix) => norbix.hub.account.verifyAccount(args),
    invalidatesTags: [{ type: 'Account', id: 'Info' }],
  }),

  createTeamMemberFromInvitation: b.mutation<
    Result<CreateTeamMemberFromInvitation>,
    Arg<CreateTeamMemberFromInvitation>
  >({
    query: (args) => (norbix) => norbix.hub.account.createTeamMemberFromInvitation(args),
    invalidatesTags: [{ type: 'AccountUsers', id: 'LIST' }],
  }),

  // ---- Projects ----
  getProjects: b.query<Result<GetProjects>, Arg<GetProjects>>({
    query: (args) => (norbix) => norbix.hub.account.getProjects(args),
    providesTags: [{ type: 'Projects', id: 'LIST' }],
  }),

  getProject: b.query<Result<GetProject>, Arg<GetProject>>({
    query: (args) => (norbix) => norbix.hub.account.getProject(args),
    providesTags: (_res, _err, arg) => [
      { type: 'Projects', id: (arg as { projectId?: string; id?: string })?.projectId ?? 'CURRENT' },
    ],
  }),

  createProject: b.mutation<Result<CreateProject>, Arg<CreateProject>>({
    query: (args) => (norbix) => norbix.hub.account.createProject(args),
    invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
  }),

  deleteProject: b.mutation<Result<DeleteProject>, Arg<DeleteProject>>({
    query: (args) => (norbix) => norbix.hub.account.deleteProject(args),
    invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
  }),

  getAccountRegions: b.query<Result<GetAccountRegions>, Arg<GetAccountRegions>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountRegions(args),
    providesTags: [{ type: 'Account', id: 'Regions' }],
  }),

  // ---- Billing (Stripe) ----
  createStripeCheckoutSession: b.mutation<
    Result<CreateStripeCheckoutSession>,
    Arg<CreateStripeCheckoutSession>
  >({
    query: (args) => (norbix) => norbix.hub.account.createStripeCheckoutSession(args),
    invalidatesTags: [{ type: 'Billing' }],
  }),

  getStripeBillingPortalUrl: b.mutation<
    Result<GetStripeBillingPortalUrl>,
    Arg<GetStripeBillingPortalUrl>
  >({
    query: (args) => (norbix) => norbix.hub.account.getStripeBillingPortalUrl(args),
  }),
});
