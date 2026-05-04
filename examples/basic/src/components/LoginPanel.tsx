import { useState, type FormEvent } from 'react';

import { useLoginMutation, useLogoutMutation } from '../norbix';
import { ErrorBox } from './ErrorBox';

/**
 * Wraps `client.login(...)` as an RTK Query mutation. After success, the
 * SDK stores the bearer token on the Norbix client AND the mutation
 * invalidates the most-affected tags (MembershipUsers/LIST,
 * Account/Profile, etc.) so cached reads refresh automatically.
 *
 * For a *full* cache reset (every endpoint), uncomment the
 * resetApiState dispatch in handleSubmit below.
 */
export function LoginPanel() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, error, data, reset }] = useLoginMutation();
  const [logout, logoutResult] = useLogoutMutation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ userName, password }).unwrap();
      // For a hard reset across every cached endpoint, also do:
      // dispatch(norbixApi.util.resetApiState());
    } catch {
      // RTK Query surfaces the error via `error` below — no need to rethrow.
    }
  }

  if (data?.bearerToken) {
    return (
      <div className="card">
        <h2>Logged in</h2>
        <p className="muted">
          Bearer token cached on the client. Subsequent calls will run as the
          logged-in user.
        </p>
        <code className="token">{redact(data.bearerToken)}</code>
        <button
          type="button"
          onClick={() => {
            logout();
            reset();
          }}
          disabled={logoutResult.isLoading}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <label>
        Email or username
        <input
          autoComplete="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
      <ErrorBox error={error} />
    </form>
  );
}

function redact(token: string) {
  if (token.length <= 12) return '***';
  return `${token.slice(0, 4)}…${token.slice(-4)}`;
}
