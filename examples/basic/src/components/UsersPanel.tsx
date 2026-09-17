import { useState, type FormEvent } from 'react';

import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useInviteUserMutation,
  useUnblockUserMutation,
} from '../norbix';
import { ErrorBox } from './ErrorBox';

/**
 * Membership demo. Three things are happening that you don't have to write:
 *
 * 1. **Cache + dedup.** If two components mount `useGetUsersQuery({ pageSize: 20 })`,
 *    only one network request goes out.
 * 2. **Tag-based invalidation.** `inviteUser`, `blockUser`, `unblockUser`,
 *    and `deleteUser` all invalidate `MembershipUsers/LIST`, so the list
 *    automatically refetches after every write — no `refetch()` call here.
 * 3. **Refetch on focus / reconnect.** RTK Query handles those at the slice
 *    level; configure them in `createNorbixApi` if you want to opt in.
 */
export function UsersPanel() {
  const pageSize = 20;
  // Cursor pagination: `cursors[i]` is the `startingAfter` of page i
  // (undefined for the first page). Next pushes the page's cursor, Prev pops.
  const [cursors, setCursors] = useState<Array<string | undefined>>([undefined]);
  const startingAfter = cursors[cursors.length - 1];
  const [inviteEmail, setInviteEmail] = useState('');

  // The hook returns a typed envelope from the SDK. We unwrap the inner page
  // here with `selectFromResult` so the component sees a plain array.
  const { users, hasMore, nextCursor, isLoading, error, refetch } = useGetUsersQuery(
    { pageSize, startingAfter },
    {
      selectFromResult: ({ data, isLoading: l, error: e }) => ({
        users: data?.list?.items ?? [],
        hasMore: data?.list?.hasMore ?? false,
        nextCursor: data?.list?.startingAfter,
        isLoading: l,
        error: e,
      }),
    },
  );

  const [invite, inviteResult] = useInviteUserMutation();
  const [block] = useBlockUserMutation();
  const [unblock] = useUnblockUserMutation();
  const [del] = useDeleteUserMutation();

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      await invite({ email: inviteEmail }).unwrap();
      setInviteEmail('');
    } catch {
      // surfaced via `inviteResult.error`
    }
  }

  return (
    <div className="card">
      <h2>Users</h2>
      <p className="muted">{users.length > 0 ? `Page ${cursors.length}` : 'No users yet'}</p>

      <form className="row" onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="invite@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <button type="submit" disabled={inviteResult.isLoading}>
          Invite
        </button>
      </form>
      <ErrorBox error={inviteResult.error} />

      {isLoading && <p>Loading…</p>}
      {error && <ErrorBox error={error} />}

      {!isLoading && users.length > 0 && (
        <ul className="users">
          {users.map((u) => (
            <li key={u.id}>
              <span>{u.email ?? u.userName ?? u.id}</span>
              <span className="row">
                {isBlocked(u.status) ? (
                  <button onClick={() => unblock({ id: u.id })}>Unblock</button>
                ) : (
                  <button onClick={() => block({ id: u.id })}>Block</button>
                )}
                <button className="danger" onClick={() => del({ id: u.id })}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="row pager">
        <button
          type="button"
          disabled={cursors.length === 1}
          onClick={() => setCursors(cursors.slice(0, -1))}
        >
          ← Prev
        </button>
        <button
          type="button"
          disabled={!hasMore || !nextCursor}
          onClick={() => setCursors([...cursors, nextCursor])}
        >
          Next →
        </button>
        <button type="button" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
    </div>
  );
}

// AuthStatus.Blocked is 128; the API may also serialize enums by name.
function isBlocked(status: unknown): boolean {
  return status === 128 || status === 'Blocked';
}
