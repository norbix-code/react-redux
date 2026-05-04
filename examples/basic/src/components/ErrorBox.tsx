import type { SerializedNorbixError } from '@norbix/react-redux';

/**
 * Tiny error renderer that knows the `SerializedNorbixError` shape the
 * package produces. Every hook surfaces errors in this shape, so you can
 * style validation field errors uniformly across the app.
 */
export function ErrorBox({ error }: { error: unknown }) {
  if (!error) return null;

  // RTK Query stores the `SerializedNorbixError` we returned from the
  // base query at this position; it can also be a generic FetchBaseQueryError
  // if some endpoint slips through fetchBaseQuery — guard for both.
  const e = error as Partial<SerializedNorbixError> & { error?: string };

  return (
    <div className="error" role="alert">
      <strong>{e.code ?? 'Error'}</strong>
      <p>{e.message ?? e.error ?? 'Unknown error'}</p>
      {e.fieldErrors && e.fieldErrors.length > 0 && (
        <ul>
          {e.fieldErrors.map((f, i) => (
            <li key={i}>
              <code>{f.fieldName ?? '?'}</code>: {f.message ?? f.errorCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
