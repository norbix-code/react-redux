import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetUsers = Norbix['api']['membership']['getUsers'];
type GetUser = Norbix['api']['membership']['getUser'];
type InviteUser = Norbix['api']['membership']['inviteUser'];
type BlockUser = Norbix['api']['membership']['blockUser'];
type UnblockUser = Norbix['api']['membership']['unblockUser'];
type DeleteUser = Norbix['api']['membership']['deleteUser'];
type UpdateUser = Norbix['api']['membership']['updateUser'];
type GetUserPreferences = Norbix['api']['membership']['getUserPreferences'];
type UpdateUserPreferences = Norbix['api']['membership']['updateUserPreferences'];
type AssignRolePermissions = Norbix['api']['membership']['assignRolePermissions'];
type SaveEmailUser = Norbix['api']['membership']['saveEmailUser'];
type SavePhoneUser = Norbix['api']['membership']['savePhoneUser'];
type SaveUserNameUser = Norbix['api']['membership']['saveUserNameUser'];
type SaveGuestUser = Norbix['api']['membership']['saveGuestUser'];

/**
 * `api.membership` — runtime user CRUD. Lives at `https://api.norbix.ai`
 * and is the surface most app code talks to.
 *
 * Tag conventions (mirror the Norbix Cloud admin UI):
 *   - `MembershipUsers/LIST`  — invalidated by every write so list refetches
 *   - `MembershipUsers/<id>`  — per-user detail, refreshed by single-user updates
 */
export const apiMembership = (b: Builder) => ({
  getUsers: b.query<Result<GetUsers>, Arg<GetUsers>>({
    query: (args) => (norbix) => norbix.api.membership.getUsers(args),
    providesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  getUser: b.query<Result<GetUser>, Arg<GetUser>>({
    query: (args) => (norbix) => norbix.api.membership.getUser(args),
    providesTags: (_res, _err, arg) => [
      { type: 'MembershipUsers', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  getUserPreferences: b.query<Result<GetUserPreferences>, Arg<GetUserPreferences>>({
    query: (args) => (norbix) => norbix.api.membership.getUserPreferences(args),
    providesTags: (_res, _err, arg) => [
      {
        type: 'MembershipUsers',
        id: `PREFS/${(arg as { id?: string })?.id ?? 'CURRENT'}`,
      },
    ],
  }),

  inviteUser: b.mutation<Result<InviteUser>, Arg<InviteUser>>({
    query: (args) => (norbix) => norbix.api.membership.inviteUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  saveEmailUser: b.mutation<Result<SaveEmailUser>, Arg<SaveEmailUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveEmailUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  savePhoneUser: b.mutation<Result<SavePhoneUser>, Arg<SavePhoneUser>>({
    query: (args) => (norbix) => norbix.api.membership.savePhoneUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  saveUserNameUser: b.mutation<Result<SaveUserNameUser>, Arg<SaveUserNameUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveUserNameUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  saveGuestUser: b.mutation<Result<SaveGuestUser>, Arg<SaveGuestUser>>({
    query: (args) => (norbix) => norbix.api.membership.saveGuestUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  updateUser: b.mutation<Result<UpdateUser>, Arg<UpdateUser>>({
    query: (args) => (norbix) => norbix.api.membership.updateUser(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'MembershipUsers', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      { type: 'MembershipUsers', id: 'LIST' },
    ],
  }),

  updateUserPreferences: b.mutation<
    Result<UpdateUserPreferences>,
    Arg<UpdateUserPreferences>
  >({
    query: (args) => (norbix) => norbix.api.membership.updateUserPreferences(args),
    invalidatesTags: (_res, _err, arg) => [
      {
        type: 'MembershipUsers',
        id: `PREFS/${(arg as { id?: string })?.id ?? 'CURRENT'}`,
      },
    ],
  }),

  assignRolePermissions: b.mutation<
    Result<AssignRolePermissions>,
    Arg<AssignRolePermissions>
  >({
    query: (args) => (norbix) => norbix.api.membership.assignRolePermissions(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'MembershipUsers', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      { type: 'MembershipUsers', id: 'LIST' },
    ],
  }),

  blockUser: b.mutation<Result<BlockUser>, Arg<BlockUser>>({
    query: (args) => (norbix) => norbix.api.membership.blockUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  unblockUser: b.mutation<Result<UnblockUser>, Arg<UnblockUser>>({
    query: (args) => (norbix) => norbix.api.membership.unblockUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),

  deleteUser: b.mutation<Result<DeleteUser>, Arg<DeleteUser>>({
    query: (args) => (norbix) => norbix.api.membership.deleteUser(args),
    invalidatesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
  }),
});
