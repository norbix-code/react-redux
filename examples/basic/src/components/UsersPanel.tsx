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
 * 1. **Cache + dedup.** If two components mount `useGetUsersQuery({ take:20 })`,
 *    only one network request goes out.
 * 2. **Tag-based invalidation.** `inviteUser`, `blockUser`, `unblockUser`,
 *    and `deleteUser` all invalidate `MembershipUsers/LIST`, so the list
 *    automatically refetches after every write — no `refetch()` call here.
 * 3. **Refetch on focus / reconnect.** RTK Query handles those at the slice
 *    level; configure them in `createNorbixApi` if you want to opt in.
 */
export function UsersPanel() {
  const [take] = useState(20);
  const [skip, setSkip] = useState(0);
  const [inviteEmail, setInviteEmail] = useState('');

  // The hook returns a typed envelope from the SDK. We unwrap the inner list
  // here with `selectFromResult` so the component sees a plain array.
  const { users, total, isLoading, error, refetch } = useGetUsersQuery(
    { take, skip },
    {
      selectFromResult: ({ data, isLoading: l, error: e }) => ({
        users: (data as { list?: { result?: unknown[] } } | undefined)?.list?.result ?? [],
        total: (data as { list?: { totalCount?: number } } | undefined)?.list?.totalCount ?? 0,
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
      <p className="muted">
        {total > 0 ? `${total} total — page ${skip / take + 1}` : 'No users yet'}
      </p>

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
          {(users as Array<{ id: string; email?: string; isBlocked?: boolean }>).map((u) => (
            <li key={u.id}>
              <span>{u.email ?? u.id}</span>
              <span className="row">
                {u.isBlocked ? (
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
          disabled={skip === 0}
          onClick={() => setSkip(Math.max(0, skip - take))}
        >
          ← Prev
        </button>
        <button
          type="button"
          disabled={skip + take >= total}
          onClick={() => setSkip(skip + take)}
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
