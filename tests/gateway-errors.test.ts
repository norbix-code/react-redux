/**
 * What lands in the Redux store when a call fails (10b-files slice ERRORS,
 * issues #66 and #67).
 *
 * This package does not parse the gateway's body itself — `@norbix.ai/ts`
 * does, and this package turns whatever it threw into the plain object RTK
 * Query keeps in state. So the four cases are driven here through
 * `createNorbixBaseQuery` with the errors the fixed SDK throws.
 *
 * The published `@norbix.ai/ts` this package builds against must be the one
 * that carries the fix (see the repo's README, "Errors"). Nothing here talks
 * to a real server.
 */
import { describe, expect, it } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';

/** The error `@norbix.ai/ts` throws, with the getters spelled out as fields. */
function sdkError(opts: {
  status: number;
  code?: string;
  message: string;
  errors?: Array<{ errorCode?: string; fieldName?: string; message?: string }>;
}) {
  return {
    name: 'NorbixError',
    status: opts.status,
    httpStatus: opts.status,
    code: opts.code,
    errorCode: opts.code,
    message: opts.message,
    fieldErrors: opts.errors ?? [],
    errors: opts.errors ?? [],
    url: 'https://api.norbix.ai/v2/files/int_7/info',
  };
}

function runThrowing(err: unknown) {
  const baseQuery = createNorbixBaseQuery(() => ({}) as never);
  return baseQuery(
    async () => {
      throw err;
    },
    {} as never,
    {},
  );
}

describe('a failed call in the store', () => {
  // (a) HTTP 400 with two errors inside responseStatus.errors
  it('keeps the gateway message, code and every error of a 400', async () => {
    const result = await runThrowing(
      sdkError({
        status: 400,
        code: 'CM-ERRORS-FILES-002',
        message: 'File name is required',
        errors: [
          {
            errorCode: 'CM-ERRORS-FILES-002',
            message: 'File name is required',
            fieldName: 'fileName',
          },
          { errorCode: 'CM-ERRORS-FILES-016', message: 'Folder does not exist' },
        ],
      }),
    );

    expect(result.data).toBeUndefined();
    expect(result.error).toMatchObject({
      status: 400,
      httpStatus: 400,
      code: 'CM-ERRORS-FILES-002',
      errorCode: 'CM-ERRORS-FILES-002',
      message: 'File name is required',
    });
    expect(result.error?.errors).toHaveLength(2);
    expect(result.error?.errors[0]?.fieldName).toBe('fileName');
    // Plain JSON only — RTK Query keeps this in the Redux state.
    expect(() => JSON.parse(JSON.stringify(result.error))).not.toThrow();
  });

  // (b) HTTP 200 the gateway marked as failed
  it('stores a refusal the gateway answered with HTTP 200 as an error', async () => {
    const result = await runThrowing(
      sdkError({
        status: 200,
        code: 'CM-ERRORS-INTEGRATIONS-001',
        message: 'Integration with id int_7 not found',
      }),
    );

    expect(result.data).toBeUndefined();
    expect(result.error).toMatchObject({
      status: 200,
      httpStatus: 200,
      errorCode: 'CM-ERRORS-INTEGRATIONS-001',
      message: 'Integration with id int_7 not found',
    });
  });

  // (c) a call that worked — unchanged
  it('a call that worked still returns { data }', async () => {
    const baseQuery = createNorbixBaseQuery(() => ({}) as never);

    const result = await baseQuery(async () => ({ id: 'f_1' }), {} as never, {});

    expect(result.error).toBeUndefined();
    expect(result.data).toEqual({ id: 'f_1' });
  });

  // (d) a 500 whose body was not JSON — the SDK's fallback text reaches the store
  it('keeps the fallback text of a 500 whose body was not JSON', async () => {
    const result = await runThrowing(
      sdkError({ status: 500, message: 'Request failed (HTTP 500)' }),
    );

    expect(result.error).toMatchObject({
      status: 500,
      httpStatus: 500,
      message: 'Request failed (HTTP 500)',
    });
    expect(result.error?.errors).toEqual([]);
  });
});
