/**
 * Type helpers that derive request and response shapes directly from the
 * SDK's own method signatures. Endpoints stay end-to-end typed without
 * importing generated DTOs by hand — when the SDK refreshes its DTOs,
 * the hooks pick up the new types automatically on `npm install`.
 */

/** Extract the resolved type of a Promise returned by an SDK method. */
export type Result<F> = F extends (...args: never[]) => Promise<infer R> ? R : never;

/**
 * Extract the request argument of an SDK method. SDK methods are shaped
 * `(request: Partial<DTO>, options?) => Promise<R>`, so the first param is
 * the meaningful argument.
 */
export type Arg<F> = F extends (request: infer A, ...rest: never[]) => unknown
  ? A
  : never;
