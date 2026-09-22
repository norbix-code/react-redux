/**
 * Serializable error shape returned by `norbixBaseQuery` to RTK Query.
 *
 * RTK Query stores the error in the Redux state, so it must be plain JSON —
 * we cannot store a `NorbixError` instance directly (Error objects don't
 * serialize cleanly). This shape preserves the high-signal fields the SDK
 * already exposes and is safe to round-trip through the store / devtools.
 *
 * The message and the error code are the gateway's own: `@norbix.ai/ts` reads
 * them out of `responseStatus.errors[]`, where the gateway puts them
 * (10b-files slice ERRORS, issue #66). Each field is here under two names —
 * `httpStatus` / `errorCode` / `errors` are the names every Norbix SDK uses,
 * `status` / `code` / `fieldErrors` are the same values under the names this
 * package has always used.
 */
export interface SerializedNorbixErrorItem {
  errorCode?: string;
  fieldName?: string;
  message?: string;
  meta?: Record<string, string | null>;
}

export interface SerializedNorbixError {
  /** HTTP status (0 for network / timeout). 200 when the gateway refused a 200 answer. */
  status: number;
  /** Same value as `status`. The name every Norbix SDK uses for it. */
  httpStatus: number;
  /** Machine-readable error code, e.g. `CM-ERRORS-FILES-016`. */
  code?: string;
  /** Same value as `code`. The name every Norbix SDK uses for it. */
  errorCode?: string;
  /** Human-readable message from the SDK / gateway. */
  message: string;
  /** Every error the gateway sent, in the order it sent them. */
  fieldErrors: SerializedNorbixErrorItem[];
  /** Same list as `fieldErrors`. The name every Norbix SDK uses for it. */
  errors: SerializedNorbixErrorItem[];
  /** Originating URL when known, useful for debugging. */
  url?: string;
}

/**
 * Convert an unknown thrown value (typically a NorbixError) into the
 * serializable shape RTK Query stores in state.
 *
 * Both name sets are read, because `httpStatus` / `errorCode` / `errors` are
 * getters on `NorbixError` (on the prototype, so a spread would miss them).
 */
export function serializeNorbixError(err: unknown): SerializedNorbixError {
  if (err && typeof err === 'object') {
    const e = err as {
      status?: number;
      httpStatus?: number;
      code?: string;
      errorCode?: string;
      message?: string;
      fieldErrors?: SerializedNorbixErrorItem[];
      errors?: SerializedNorbixErrorItem[];
      url?: string;
    };
    const status =
      typeof e.status === 'number' ? e.status : typeof e.httpStatus === 'number' ? e.httpStatus : 0;
    const code = e.code ?? e.errorCode;
    const list = Array.isArray(e.fieldErrors)
      ? e.fieldErrors
      : Array.isArray(e.errors)
        ? e.errors
        : [];
    return {
      status,
      httpStatus: status,
      code,
      errorCode: code,
      message: e.message ?? 'Unknown Norbix error',
      fieldErrors: list,
      errors: list,
      url: e.url,
    };
  }
  const message = typeof err === 'string' ? err : 'Unknown Norbix error';
  return {
    status: 0,
    httpStatus: 0,
    message,
    fieldErrors: [],
    errors: [],
  };
}
