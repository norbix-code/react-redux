// AUTO-GENERATED — full coverage of the `norbix.hub.account` Project surface (46 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetAccountProfile = Norbix['hub']['account']['getAccountProfile'];
type UpdateAccountProfile = Norbix['hub']['account']['updateAccountProfile'];
type ResendAccountVerificationToken = Norbix['hub']['account']['resendAccountVerificationToken'];
type GetAccountStatus = Norbix['hub']['account']['getAccountStatus'];
type CreateStripeCheckoutSession = Norbix['hub']['account']['createStripeCheckoutSession'];
type GetStripeBillingPortalUrl = Norbix['hub']['account']['getStripeBillingPortalUrl'];
type CreateTeamMemberFromInvitation = Norbix['hub']['account']['createTeamMemberFromInvitation'];
type VerifyAccount = Norbix['hub']['account']['verifyAccount'];
type DeleteNotificationsGroup = Norbix['hub']['account']['deleteNotificationsGroup'];
type DeleteNotificationsTag = Norbix['hub']['account']['deleteNotificationsTag'];
type RemoveTagFromNotificationsGroup = Norbix['hub']['account']['removeTagFromNotificationsGroup'];
type SaveNotificationsGroup = Norbix['hub']['account']['saveNotificationsGroup'];
type SaveNotificationsTag = Norbix['hub']['account']['saveNotificationsTag'];
type CreateProject = Norbix['hub']['account']['createProject'];
type DeleteProject = Norbix['hub']['account']['deleteProject'];
type GetProject = Norbix['hub']['account']['getProject'];
type GetProjects = Norbix['hub']['account']['getProjects'];
type GetAccountRegions = Norbix['hub']['account']['getAccountRegions'];
type GetProjectTokens = Norbix['hub']['account']['getProjectTokens'];
type UpdateProjectAccentColor = Norbix['hub']['account']['updateProjectAccentColor'];
type UpdateProjectIcon = Norbix['hub']['account']['updateProjectIcon'];
type UpdateProjectLogo = Norbix['hub']['account']['updateProjectLogo'];
type UpdateProjectMainColor = Norbix['hub']['account']['updateProjectMainColor'];
type UpdateProjectAllowedOrigins = Norbix['hub']['account']['updateProjectAllowedOrigins'];
type UpdateProjectDefaultLanguage = Norbix['hub']['account']['updateProjectDefaultLanguage'];
type UpdateProjectDescription = Norbix['hub']['account']['updateProjectDescription'];
type DisableProject = Norbix['hub']['account']['disableProject'];
type EnableProject = Norbix['hub']['account']['enableProject'];
type UpdateProjectLanguages = Norbix['hub']['account']['updateProjectLanguages'];
type UpdateProjectUrl = Norbix['hub']['account']['updateProjectUrl'];
type UpdateProjectName = Norbix['hub']['account']['updateProjectName'];
type UpdateProjectRegions = Norbix['hub']['account']['updateProjectRegions'];
type CreateAccount = Norbix['hub']['account']['createAccount'];
type GetAccountCollaborators = Norbix['hub']['account']['getAccountCollaborators'];
type SendInviteToTeamMember = Norbix['hub']['account']['sendInviteToTeamMember'];
type GetLicenses = Norbix['hub']['account']['getLicenses'];
type GetProjectAiSettings = Norbix['hub']['account']['getProjectAiSettings'];
type UpdateProjectAiSettings = Norbix['hub']['account']['updateProjectAiSettings'];
type CreateProjectAiAssistant = Norbix['hub']['account']['createProjectAiAssistant'];
type UpdateProjectAiAssistant = Norbix['hub']['account']['updateProjectAiAssistant'];
type DeleteProjectAiAssistant = Norbix['hub']['account']['deleteProjectAiAssistant'];
type GetProjectAiUsage = Norbix['hub']['account']['getProjectAiUsage'];
type SetAdminPortalEnabled = Norbix['hub']['account']['setAdminPortalEnabled'];
type UpdateProjectAdminUrl = Norbix['hub']['account']['updateProjectAdminUrl'];
type UpdateProjectLegalDocuments = Norbix['hub']['account']['updateProjectLegalDocuments'];
type UpdateProjectExposeLegal = Norbix['hub']['account']['updateProjectExposeLegal'];
type GetAdminPortalStructure = Norbix['hub']['account']['getAdminPortalStructure'];
type AssignAdminPortalServiceUser = Norbix['hub']['account']['assignAdminPortalServiceUser'];
type CreateAiServiceUser = Norbix['hub']['account']['createAiServiceUser'];
type ListAiServiceUsers = Norbix['hub']['account']['listAiServiceUsers'];
type DeleteAiServiceUser = Norbix['hub']['account']['deleteAiServiceUser'];
type RotateAiServiceUserKey = Norbix['hub']['account']['rotateAiServiceUserKey'];
type RevokeAiServiceUserKey = Norbix['hub']['account']['revokeAiServiceUserKey'];

/**
 * `hub.account` — 46 endpoints, 1:1 with the core SDK.
 *
 * Not wrapped: `mcp` (`/account/mcp`) — a JSON-RPC stream for MCP clients,
 * not a request/response call a cached hook can model. Use `useNorbix()`.
 */
export const hubAccount = (b: Builder) => ({
  getAccountProfile: b.query<Result<GetAccountProfile>, Arg<GetAccountProfile>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountProfile(args),
    providesTags: ['Account'],
  }),

  updateAccountProfile: b.mutation<Result<UpdateAccountProfile>, Arg<UpdateAccountProfile>>({
    query: (args) => (norbix) => norbix.hub.account.updateAccountProfile(args),
    invalidatesTags: ['Account'],
  }),

  resendAccountVerificationToken: b.mutation<
    Result<ResendAccountVerificationToken>,
    Arg<ResendAccountVerificationToken>
  >({
    query: (args) => (norbix) => norbix.hub.account.resendAccountVerificationToken(args),
    invalidatesTags: ['Account'],
  }),

  getAccountStatus: b.query<Result<GetAccountStatus>, Arg<GetAccountStatus>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountStatus(args),
    providesTags: ['Account'],
  }),

  createStripeCheckoutSession: b.mutation<
    Result<CreateStripeCheckoutSession>,
    Arg<CreateStripeCheckoutSession>
  >({
    query: (args) => (norbix) => norbix.hub.account.createStripeCheckoutSession(args),
    invalidatesTags: ['Billing'],
  }),

  getStripeBillingPortalUrl: b.query<
    Result<GetStripeBillingPortalUrl>,
    Arg<GetStripeBillingPortalUrl>
  >({
    query: (args) => (norbix) => norbix.hub.account.getStripeBillingPortalUrl(args),
    providesTags: ['Billing'],
  }),

  createTeamMemberFromInvitation: b.mutation<
    Result<CreateTeamMemberFromInvitation>,
    Arg<CreateTeamMemberFromInvitation>
  >({
    query: (args) => (norbix) => norbix.hub.account.createTeamMemberFromInvitation(args),
    invalidatesTags: ['Account'],
  }),

  verifyAccount: b.mutation<Result<VerifyAccount>, Arg<VerifyAccount>>({
    query: (args) => (norbix) => norbix.hub.account.verifyAccount(args),
    invalidatesTags: ['Account'],
  }),

  deleteNotificationsGroup: b.mutation<
    Result<DeleteNotificationsGroup>,
    Arg<DeleteNotificationsGroup>
  >({
    query: (args) => (norbix) => norbix.hub.account.deleteNotificationsGroup(args),
    invalidatesTags: ['Account'],
  }),

  deleteNotificationsTag: b.mutation<Result<DeleteNotificationsTag>, Arg<DeleteNotificationsTag>>({
    query: (args) => (norbix) => norbix.hub.account.deleteNotificationsTag(args),
    invalidatesTags: ['Account'],
  }),

  removeTagFromNotificationsGroup: b.mutation<
    Result<RemoveTagFromNotificationsGroup>,
    Arg<RemoveTagFromNotificationsGroup>
  >({
    query: (args) => (norbix) => norbix.hub.account.removeTagFromNotificationsGroup(args),
    invalidatesTags: ['Account'],
  }),

  saveNotificationsGroup: b.mutation<Result<SaveNotificationsGroup>, Arg<SaveNotificationsGroup>>({
    query: (args) => (norbix) => norbix.hub.account.saveNotificationsGroup(args),
    invalidatesTags: ['Account'],
  }),

  saveNotificationsTag: b.mutation<Result<SaveNotificationsTag>, Arg<SaveNotificationsTag>>({
    query: (args) => (norbix) => norbix.hub.account.saveNotificationsTag(args),
    invalidatesTags: ['Account'],
  }),

  createProject: b.mutation<Result<CreateProject>, Arg<CreateProject>>({
    query: (args) => (norbix) => norbix.hub.account.createProject(args),
    invalidatesTags: ['Projects'],
  }),

  deleteProject: b.mutation<Result<DeleteProject>, Arg<DeleteProject>>({
    query: (args) => (norbix) => norbix.hub.account.deleteProject(args),
    invalidatesTags: ['Projects'],
  }),

  getProject: b.query<Result<GetProject>, Arg<GetProject>>({
    query: (args) => (norbix) => norbix.hub.account.getProject(args),
    providesTags: ['Projects'],
  }),

  getProjects: b.query<Result<GetProjects>, Arg<GetProjects>>({
    query: (args) => (norbix) => norbix.hub.account.getProjects(args),
    providesTags: ['Projects'],
  }),

  getAccountRegions: b.query<Result<GetAccountRegions>, Arg<GetAccountRegions>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountRegions(args),
    providesTags: ['Account'],
  }),

  getProjectTokens: b.query<Result<GetProjectTokens>, Arg<GetProjectTokens>>({
    query: (args) => (norbix) => norbix.hub.account.getProjectTokens(args),
    providesTags: ['Projects'],
  }),

  updateProjectAccentColor: b.mutation<
    Result<UpdateProjectAccentColor>,
    Arg<UpdateProjectAccentColor>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectAccentColor(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectIcon: b.mutation<Result<UpdateProjectIcon>, Arg<UpdateProjectIcon>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectIcon(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectLogo: b.mutation<Result<UpdateProjectLogo>, Arg<UpdateProjectLogo>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectLogo(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectMainColor: b.mutation<Result<UpdateProjectMainColor>, Arg<UpdateProjectMainColor>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectMainColor(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectAllowedOrigins: b.mutation<
    Result<UpdateProjectAllowedOrigins>,
    Arg<UpdateProjectAllowedOrigins>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectAllowedOrigins(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectDefaultLanguage: b.mutation<
    Result<UpdateProjectDefaultLanguage>,
    Arg<UpdateProjectDefaultLanguage>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectDefaultLanguage(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectDescription: b.mutation<
    Result<UpdateProjectDescription>,
    Arg<UpdateProjectDescription>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectDescription(args),
    invalidatesTags: ['Projects'],
  }),

  disableProject: b.mutation<Result<DisableProject>, Arg<DisableProject>>({
    query: (args) => (norbix) => norbix.hub.account.disableProject(args),
    invalidatesTags: ['Projects'],
  }),

  enableProject: b.mutation<Result<EnableProject>, Arg<EnableProject>>({
    query: (args) => (norbix) => norbix.hub.account.enableProject(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectLanguages: b.mutation<Result<UpdateProjectLanguages>, Arg<UpdateProjectLanguages>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectLanguages(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectUrl: b.mutation<Result<UpdateProjectUrl>, Arg<UpdateProjectUrl>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectUrl(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectName: b.mutation<Result<UpdateProjectName>, Arg<UpdateProjectName>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectName(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectRegions: b.mutation<Result<UpdateProjectRegions>, Arg<UpdateProjectRegions>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectRegions(args),
    invalidatesTags: ['Projects'],
  }),

  createAccount: b.mutation<Result<CreateAccount>, Arg<CreateAccount>>({
    query: (args) => (norbix) => norbix.hub.account.createAccount(args),
    invalidatesTags: ['Account'],
  }),

  getAccountCollaborators: b.query<Result<GetAccountCollaborators>, Arg<GetAccountCollaborators>>({
    query: (args) => (norbix) => norbix.hub.account.getAccountCollaborators(args),
    providesTags: ['Account'],
  }),

  sendInviteToTeamMember: b.mutation<Result<SendInviteToTeamMember>, Arg<SendInviteToTeamMember>>({
    query: (args) => (norbix) => norbix.hub.account.sendInviteToTeamMember(args),
    invalidatesTags: ['Account'],
  }),

  getLicenses: b.query<Result<GetLicenses>, Arg<GetLicenses>>({
    query: (args) => (norbix) => norbix.hub.account.getLicenses(args),
    providesTags: ['Billing'],
  }),

  getProjectAiSettings: b.query<Result<GetProjectAiSettings>, Arg<GetProjectAiSettings>>({
    query: (args) => (norbix) => norbix.hub.account.getProjectAiSettings(args),
    providesTags: ['Projects'],
  }),

  updateProjectAiSettings: b.mutation<
    Result<UpdateProjectAiSettings>,
    Arg<UpdateProjectAiSettings>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectAiSettings(args),
    invalidatesTags: ['Projects'],
  }),

  createProjectAiAssistant: b.mutation<
    Result<CreateProjectAiAssistant>,
    Arg<CreateProjectAiAssistant>
  >({
    query: (args) => (norbix) => norbix.hub.account.createProjectAiAssistant(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectAiAssistant: b.mutation<
    Result<UpdateProjectAiAssistant>,
    Arg<UpdateProjectAiAssistant>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectAiAssistant(args),
    invalidatesTags: ['Projects'],
  }),

  deleteProjectAiAssistant: b.mutation<
    Result<DeleteProjectAiAssistant>,
    Arg<DeleteProjectAiAssistant>
  >({
    query: (args) => (norbix) => norbix.hub.account.deleteProjectAiAssistant(args),
    invalidatesTags: ['Projects'],
  }),

  getProjectAiUsage: b.query<Result<GetProjectAiUsage>, Arg<GetProjectAiUsage>>({
    query: (args) => (norbix) => norbix.hub.account.getProjectAiUsage(args),
    providesTags: ['Projects'],
  }),

  setAdminPortalEnabled: b.mutation<Result<SetAdminPortalEnabled>, Arg<SetAdminPortalEnabled>>({
    query: (args) => (norbix) => norbix.hub.account.setAdminPortalEnabled(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectAdminUrl: b.mutation<Result<UpdateProjectAdminUrl>, Arg<UpdateProjectAdminUrl>>({
    query: (args) => (norbix) => norbix.hub.account.updateProjectAdminUrl(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectLegalDocuments: b.mutation<
    Result<UpdateProjectLegalDocuments>,
    Arg<UpdateProjectLegalDocuments>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectLegalDocuments(args),
    invalidatesTags: ['Projects'],
  }),

  updateProjectExposeLegal: b.mutation<
    Result<UpdateProjectExposeLegal>,
    Arg<UpdateProjectExposeLegal>
  >({
    query: (args) => (norbix) => norbix.hub.account.updateProjectExposeLegal(args),
    invalidatesTags: ['Projects'],
  }),

  getAdminPortalStructure: b.query<Result<GetAdminPortalStructure>, Arg<GetAdminPortalStructure>>({
    query: (args) => (norbix) => norbix.hub.account.getAdminPortalStructure(args),
    providesTags: ['Projects'],
  }),

  assignAdminPortalServiceUser: b.mutation<
    Result<AssignAdminPortalServiceUser>,
    Arg<AssignAdminPortalServiceUser>
  >({
    query: (args) => (norbix) => norbix.hub.account.assignAdminPortalServiceUser(args),
    invalidatesTags: ['Projects'],
  }),

  createAiServiceUser: b.mutation<Result<CreateAiServiceUser>, Arg<CreateAiServiceUser>>({
    query: (args) => (norbix) => norbix.hub.account.createAiServiceUser(args),
    invalidatesTags: ['Projects'],
  }),

  listAiServiceUsers: b.query<Result<ListAiServiceUsers>, Arg<ListAiServiceUsers>>({
    query: (args) => (norbix) => norbix.hub.account.listAiServiceUsers(args),
    providesTags: ['Projects'],
  }),

  deleteAiServiceUser: b.mutation<Result<DeleteAiServiceUser>, Arg<DeleteAiServiceUser>>({
    query: (args) => (norbix) => norbix.hub.account.deleteAiServiceUser(args),
    invalidatesTags: ['Projects'],
  }),

  rotateAiServiceUserKey: b.mutation<Result<RotateAiServiceUserKey>, Arg<RotateAiServiceUserKey>>({
    query: (args) => (norbix) => norbix.hub.account.rotateAiServiceUserKey(args),
    invalidatesTags: ['Projects'],
  }),

  revokeAiServiceUserKey: b.mutation<Result<RevokeAiServiceUserKey>, Arg<RevokeAiServiceUserKey>>({
    query: (args) => (norbix) => norbix.hub.account.revokeAiServiceUserKey(args),
    invalidatesTags: ['Projects'],
  }),
});
