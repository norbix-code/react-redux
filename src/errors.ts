/**
 * Serializable error shape returned by `norbixBaseQuery` to RTK Query.
 *
 * RTK Query stores the error in the Redux state, so it must be plain JSON —
 * we cannot store a `NorbixError` instance directly (Error objects don't
 * serialize cleanly). This shape preserves the high-signal fields the SDK
 * already exposes and is safe to round-trip through the store / devtools.
 */
export interface SerializedNorbixError {
  /** HTTP status (0 for network / timeout). */
  status: number;
  /** Machine-readable error code, e.g. `NORBIX_NOT_AUTHENTICATED`. */
  code?: string;
  /** Human-readable message from the SDK / gateway. */
  message: string;
  /** Per-field validation errors when the gateway returns them. */
  fieldErrors: Array<{
    errorCode?: string;
    fieldName?: string;
    message?: string;
    meta?: Record<string, string>;
  }>;
  /** Originating URL when known, useful for debugging. */
  url?: string;
}

/**
 * Convert an unknown thrown value (typically a NorbixError) into the
 * serializable shape RTK Query stores in state.
 */
export function serializeNorbixError(err: unknown): SerializedNorbixError {
  if (err && typeof err === 'object') {
    const e = err as {
      status?: number;
      code?: string;
      message?: string;
      fieldErrors?: SerializedNorbixError['fieldErrors'];
      url?: string;
    };
    return {
      status: typeof e.status === 'number' ? e.status : 0,
      code: e.code,
      message: e.message ?? 'Unknown Norbix error',
      fieldErrors: Array.isArray(e.fieldErrors) ? e.fieldErrors : [],
      url: e.url,
    };
  }
  return {
    status: 0,
    message: typeof err === 'string' ? err : 'Unknown Norbix error',
    fieldErrors: [],
  };
}
