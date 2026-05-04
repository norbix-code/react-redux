import { Norbix } from 'norbix';
import { createNorbixApi } from '@norbix/react-redux';

/**
 * One Norbix client per app. Reads `NORBIX_*` env vars (Vite exposes them
 * as `import.meta.env.VITE_NORBIX_*`); for this example we pass the values
 * explicitly so the file reads top-to-bottom.
 */
export const norbix = new Norbix({
  apiKey: import.meta.env.VITE_NORBIX_API_KEY,
  projectId: import.meta.env.VITE_NORBIX_PROJECT_ID,
  // accountId is required only for account-scoped Hub endpoints
  accountId: import.meta.env.VITE_NORBIX_ACCOUNT_ID,
});

/**
 * One RTK Query API slice for the whole app. The factory closes over the
 * Norbix client above; if you needed per-tenant scoping you would pass a
 * resolver that reads from Redux instead of a constant.
 */
export const norbixApi = createNorbixApi(() => norbix);

// Re-export the hooks the example actually uses. Adding more is a one-line
// change — every hook in the curated set is on `norbixApi`.
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useInviteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useDeleteUserMutation,
  useFindCollectionQuery,
} = norbixApi;
