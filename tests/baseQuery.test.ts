import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';

describe('createNorbixBaseQuery', () => {
  it('returns { data } when the closure resolves', async () => {
    const fakeClient = { token: 'abc' };
    const baseQuery = createNorbixBaseQuery(() => fakeClient as never);

    const result = await baseQuery(
      async (norbix) => {
        return { ok: true, sawClient: norbix === fakeClient };
      },
      // RTK Query passes a BaseQueryApi + extraOptions; we don't use them.
      {} as never,
      undefined,
    );

    expect(result).toEqual({ data: { ok: true, sawClient: true } });
  });

  it('returns { error } shape when the closure rejects with a NorbixError-like object', async () => {
    const baseQuery = createNorbixBaseQuery(() => ({}) as never);

    const result = await baseQuery(
      async () => {
        throw {
          status: 401,
          code: 'NORBIX_NOT_AUTHENTICATED',
          message: 'No api key',
          fieldErrors: [],
        };
      },
      {} as never,
      undefined,
    );

    expect(result).toMatchObject({
      error: {
        status: 401,
        code: 'NORBIX_NOT_AUTHENTICATED',
        message: 'No api key',
      },
    });
  });

  it('returns NORBIX_NO_CLIENT when getClient yields a null/undefined client', async () => {
    const baseQuery = createNorbixBaseQuery(() => null as never);
    const call = vi.fn();

    const result = await baseQuery(call, {} as never, undefined);

    expect(result).toMatchObject({
      error: { code: 'NORBIX_NO_CLIENT', status: 0 },
    });
    expect(call).not.toHaveBeenCalled();
  });

  it('returns serialized error when getClient itself throws', async () => {
    const baseQuery = createNorbixBaseQuery(() => {
      throw new Error('client init failed');
    });

    const result = await baseQuery(async () => 'never', {} as never, undefined);

    expect(result).toMatchObject({
      error: {
        status: 0,
        message: 'client init failed',
      },
    });
  });

  it('handles non-Error throws (string, undefined)', async () => {
    const baseQuery = createNorbixBaseQuery(() => ({}) as never);

    const stringResult = await baseQuery(
      async () => {
        throw 'oops';
      },
      {} as never,
      undefined,
    );
    expect(stringResult).toMatchObject({
      error: { status: 0, message: 'oops' },
    });
  });
});
