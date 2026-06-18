// AUTO-GENERATED — full coverage of `norbix.api.membership` (34 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type BlockUser = Norbix['api']['membership']['blockUser'];
type SaveSystemUserWithPermissions = Norbix['api']['membership']['saveSystemUserWithPermissions'];
type SaveGuestUser = Norbix['api']['membership']['saveGuestUser'];
type SaveUserNameUser = Norbix['api']['membership']['saveUserNameUser'];
type SaveEmailUser = Norbix['api']['membership']['saveEmailUser'];
type SavePhoneUser = Norbix['api']['membership']['savePhoneUser'];
type SavePhoneUserNameWithPermissions = Norbix['api']['membership']['savePhoneUserNameWithPermissions'];
type SaveEmailUserNameWithPermissions = Norbix['api']['membership']['saveEmailUserNameWithPermissions'];
type SaveUserNameWithPermissions = Norbix['api']['membership']['saveUserNameWithPermissions'];
type DeleteUser = Norbix['api']['membership']['deleteUser'];
type GetUser = Norbix['api']['membership']['getUser'];
type GetUsers = Norbix['api']['membership']['getUsers'];
type GetUserPreferences = Norbix['api']['membership']['getUserPreferences'];
type InviteUser = Norbix['api']['membership']['inviteUser'];
type LinkIdentity = Norbix['api']['membership']['linkIdentity'];
type AssignRolePermissions = Norbix['api']['membership']['assignRolePermissions'];
type UnblockUser = Norbix['api']['membership']['unblockUser'];
type UpdateUser = Norbix['api']['membership']['updateUser'];
type UpdateUserPreferences = Norbix['api']['membership']['updateUserPreferences'];
type PasskeyAuthenticationOptions = Norbix['api']['membership']['passkeyAuthenticationOptions'];
type VerifyPasskeyAuthentication = Norbix['api']['membership']['verifyPasskeyAuthentication'];
type ListPasskeys = Norbix['api']['membership']['listPasskeys'];
type RenamePasskey = Norbix['api']['membership']['renamePasskey'];
type RevokePasskey = Norbix['api']['membership']['revokePasskey'];
type UseRecoveryCode = Norbix['api']['membership']['useRecoveryCode'];
type RequestMagicLink = Norbix['api']['membership']['requestMagicLink'];
type ConsumeMagicLink = Norbix['api']['membership']['consumeMagicLink'];
type HasPasskey = Norbix['api']['membership']['hasPasskey'];
type StartEmailVerification = Norbix['api']['membership']['startEmailVerification'];
type ConfirmEmailVerification = Norbix['api']['membership']['confirmEmailVerification'];
type PasskeyRegistrationOptions = Norbix['api']['membership']['passkeyRegistrationOptions'];
type VerifyPasskeyRegistration = Norbix['api']['membership']['verifyPasskeyRegistration'];
type RefreshPasskeyToken = Norbix['api']['membership']['refreshPasskeyToken'];
type PasskeyLogout = Norbix['api']['membership']['passkeyLogout'];
type ChangePassword = Norbix['api']['membership']['changePassword'];
type RequestPasswordReset = Norbix['api']['membership']['requestPasswordReset'];
type ConfirmPasswordReset = Norbix['api']['membership']['confirmPasswordReset'];

/**
 * `api.membership` — 34 endpoints, 1:1 with the core SDK.
 */
export const apiMembership = (b: Builder) => ({
  blockUser: b.mutation<Result<BlockUser>, Arg<BlockUser>>({
    query: (args) => (norbix) => norbix.api.membership.blockUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveSystemUserWithPermissions: b.mutation<Result<SaveSystemUserWithPermissions>, Arg<SaveSystemUserWithPermissions>>({
    query: (args) => (norbix) => norbix.api.membership.saveSystemUserWithPermissions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveGuestUser: b.mutation<Result<SaveGuestUser>, Arg<SaveGuestUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveGuestUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveUserNameUser: b.mutation<Result<SaveUserNameUser>, Arg<SaveUserNameUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveUserNameUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveEmailUser: b.mutation<Result<SaveEmailUser>, Arg<SaveEmailUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveEmailUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  savePhoneUser: b.mutation<Result<SavePhoneUser>, Arg<SavePhoneUser>>({
    query: (args) => (norbix) => norbix.api.membership.savePhoneUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  savePhoneUserNameWithPermissions: b.mutation<Result<SavePhoneUserNameWithPermissions>, Arg<SavePhoneUserNameWithPermissions>>({
    query: (args) => (norbix) => norbix.api.membership.savePhoneUserNameWithPermissions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveEmailUserNameWithPermissions: b.mutation<Result<SaveEmailUserNameWithPermissions>, Arg<SaveEmailUserNameWithPermissions>>({
    query: (args) => (norbix) => norbix.api.membership.saveEmailUserNameWithPermissions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  saveUserNameWithPermissions: b.mutation<Result<SaveUserNameWithPermissions>, Arg<SaveUserNameWithPermissions>>({
    query: (args) => (norbix) => norbix.api.membership.saveUserNameWithPermissions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  deleteUser: b.mutation<Result<DeleteUser>, Arg<DeleteUser>>({
    query: (args) => (norbix) => norbix.api.membership.deleteUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  getUser: b.query<Result<GetUser>, Arg<GetUser>>({
    query: (args) => (norbix) => norbix.api.membership.getUser(args),
    providesTags: ['MembershipUsers'],
  }),

  getUsers: b.query<Result<GetUsers>, Arg<GetUsers>>({
    query: (args) => (norbix) => norbix.api.membership.getUsers(args),
    providesTags: ['MembershipUsers'],
  }),

  getUserPreferences: b.query<Result<GetUserPreferences>, Arg<GetUserPreferences>>({
    query: (args) => (norbix) => norbix.api.membership.getUserPreferences(args),
    providesTags: ['MembershipUsers'],
  }),

  inviteUser: b.mutation<Result<InviteUser>, Arg<InviteUser>>({
    query: (args) => (norbix) => norbix.api.membership.inviteUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  linkIdentity: b.mutation<Result<LinkIdentity>, Arg<LinkIdentity>>({
    query: (args) => (norbix) => norbix.api.membership.linkIdentity(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  assignRolePermissions: b.mutation<Result<AssignRolePermissions>, Arg<AssignRolePermissions>>({
    query: (args) => (norbix) => norbix.api.membership.assignRolePermissions(args),
    invalidatesTags: ['MembershipRoles'],
  }),

  unblockUser: b.mutation<Result<UnblockUser>, Arg<UnblockUser>>({
    query: (args) => (norbix) => norbix.api.membership.unblockUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  updateUser: b.mutation<Result<UpdateUser>, Arg<UpdateUser>>({
    query: (args) => (norbix) => norbix.api.membership.updateUser(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  updateUserPreferences: b.mutation<Result<UpdateUserPreferences>, Arg<UpdateUserPreferences>>({
    query: (args) => (norbix) => norbix.api.membership.updateUserPreferences(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  passkeyAuthenticationOptions: b.mutation<Result<PasskeyAuthenticationOptions>, Arg<PasskeyAuthenticationOptions>>({
    query: (args) => (norbix) => norbix.api.membership.passkeyAuthenticationOptions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  verifyPasskeyAuthentication: b.mutation<Result<VerifyPasskeyAuthentication>, Arg<VerifyPasskeyAuthentication>>({
    query: (args) => (norbix) => norbix.api.membership.verifyPasskeyAuthentication(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  listPasskeys: b.query<Result<ListPasskeys>, Arg<ListPasskeys>>({
    query: (args) => (norbix) => norbix.api.membership.listPasskeys(args),
    providesTags: ['MembershipUsers'],
  }),

  renamePasskey: b.mutation<Result<RenamePasskey>, Arg<RenamePasskey>>({
    query: (args) => (norbix) => norbix.api.membership.renamePasskey(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  revokePasskey: b.mutation<Result<RevokePasskey>, Arg<RevokePasskey>>({
    query: (args) => (norbix) => norbix.api.membership.revokePasskey(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  useRecoveryCode: b.mutation<Result<UseRecoveryCode>, Arg<UseRecoveryCode>>({
    query: (args) => (norbix) => norbix.api.membership.useRecoveryCode(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  requestMagicLink: b.mutation<Result<RequestMagicLink>, Arg<RequestMagicLink>>({
    query: (args) => (norbix) => norbix.api.membership.requestMagicLink(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  consumeMagicLink: b.mutation<Result<ConsumeMagicLink>, Arg<ConsumeMagicLink>>({
    query: (args) => (norbix) => norbix.api.membership.consumeMagicLink(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  hasPasskey: b.query<Result<HasPasskey>, Arg<HasPasskey>>({
    query: (args) => (norbix) => norbix.api.membership.hasPasskey(args),
    providesTags: ['MembershipUsers'],
  }),

  startEmailVerification: b.mutation<Result<StartEmailVerification>, Arg<StartEmailVerification>>({
    query: (args) => (norbix) => norbix.api.membership.startEmailVerification(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  confirmEmailVerification: b.mutation<Result<ConfirmEmailVerification>, Arg<ConfirmEmailVerification>>({
    query: (args) => (norbix) => norbix.api.membership.confirmEmailVerification(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  passkeyRegistrationOptions: b.mutation<Result<PasskeyRegistrationOptions>, Arg<PasskeyRegistrationOptions>>({
    query: (args) => (norbix) => norbix.api.membership.passkeyRegistrationOptions(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  verifyPasskeyRegistration: b.mutation<Result<VerifyPasskeyRegistration>, Arg<VerifyPasskeyRegistration>>({
    query: (args) => (norbix) => norbix.api.membership.verifyPasskeyRegistration(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  refreshPasskeyToken: b.mutation<Result<RefreshPasskeyToken>, Arg<RefreshPasskeyToken>>({
    query: (args) => (norbix) => norbix.api.membership.refreshPasskeyToken(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  passkeyLogout: b.mutation<Result<PasskeyLogout>, Arg<PasskeyLogout>>({
    query: (args) => (norbix) => norbix.api.membership.passkeyLogout(args),
    invalidatesTags: ['MembershipUsers'],
  }),

  // ---- password (change + reset) -------------------------------------
  changePassword: b.mutation<Result<ChangePassword>, Arg<ChangePassword>>({
    query: (args) => (norbix) => norbix.api.membership.changePassword(args),
  }),

  requestPasswordReset: b.mutation<Result<RequestPasswordReset>, Arg<RequestPasswordReset>>({
    query: (args) => (norbix) => norbix.api.membership.requestPasswordReset(args),
  }),

  confirmPasswordReset: b.mutation<Result<ConfirmPasswordReset>, Arg<ConfirmPasswordReset>>({
    query: (args) => (norbix) => norbix.api.membership.confirmPasswordReset(args),
  }),
});
