import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { createNorbixApi } from '../src/createNorbixApi.js';
import { hubAccount } from '../src/hooks/hub/account.js';

/**
 * Bundle discount codes — two `hub.account` hooks:
 *
 *   POST /account/stripe/discount/check   checkBundleDiscount
 *   POST /account/stripe/discount         applyBundleDiscount
 *
 * The real `@norbix.ai/ts` client (4.70.0 or newer) runs with a fake fetch —
 * never a real server — so the verb, the full path, the body and a refused
 * code's reason are checked as they go over the wire.
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
}

type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: unknown;
  invalidatesTags?: unknown;
};

const endpoints = hubAccount(fakeBuilder()) as unknown as Record<string, Def>;
const HUB = 'https://hub.norbix.io/v2';

function run(key: string, args: unknown, payload: unknown, status = 200) {
  type FetchFn = typeof globalThis.fetch;
  const seen: Array<{ url: string; method: string; body: string | undefined }> = [];
  const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
    seen.push({
      url: String(input),
      method: (init?.method ?? 'GET').toUpperCase(),
      body: typeof init?.body === 'string' ? init.body : undefined,
    });
    return new globalThis.Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as FetchFn;
  const norbix = new Norbix({
    bearerToken: 'test-token',
    projectId: 'test-project',
    apiVersion: 'v2',
    hubVersion: 'v2',
    baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
    fetch: fetchImpl,
  });
  const baseQuery = createNorbixBaseQuery(() => norbix);
  const result = baseQuery(endpoints[key]!.query(args) as never, {} as never, {});
  return { seen, result };
}

describe('hubAccount — bundle discount codes', () => {
  it('check is a mutation that leaves the cache alone; apply re-reads billing and the account', () => {
    expect(endpoints['checkBundleDiscount']!.__kind).toBe('mutation');
    expect(endpoints['checkBundleDiscount']!.invalidatesTags).toBeUndefined();
    expect(endpoints['applyBundleDiscount']!.__kind).toBe('mutation');
    expect(endpoints['applyBundleDiscount']!.invalidatesTags).toEqual(
      expect.arrayContaining(endpoints['getAccountStatus']!.providesTags as string[]),
    );
  });

  it.each(['useCheckBundleDiscountMutation', 'useApplyBundleDiscountMutation'])(
    'createNorbixApi ships %s',
    (hook) => {
      const api = createNorbixApi(() => ({}) as never) as unknown as Record<string, unknown>;
      expect(typeof api[hook]).toBe('function');
    },
  );

  it('checkBundleDiscount sends POST /v2/account/stripe/discount/check and returns the discount', async () => {
    const discount = { code: 'LAUNCH30', percentOff: 30, months: 3 };
    const { seen, result } = run(
      'checkBundleDiscount',
      { code: 'LAUNCH30', bundle: 'Growth', billingPeriod: 'Monthly' },
      { discount },
    );
    const out = (await result) as { data?: { discount?: unknown }; error?: unknown };
    expect(out.error).toBeUndefined();
    expect(out.data?.discount).toEqual(discount);
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/account/stripe/discount/check`);
    expect(JSON.parse(seen[0]!.body!)).toEqual({
      code: 'LAUNCH30',
      bundle: 'Growth',
      billingPeriod: 'Monthly',
    });
  });

  it('applyBundleDiscount sends POST /v2/account/stripe/discount with the code', async () => {
    const { seen, result } = run(
      'applyBundleDiscount',
      { code: 'LAUNCH30' },
      { responseStatus: {} },
    );
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/account/stripe/discount`);
    expect(JSON.parse(seen[0]!.body!)).toEqual({ code: 'LAUNCH30' });
  });

  it('a refused code comes back as CM-ERRORS-ACCOUNT-027 with the reason', async () => {
    const { result } = run(
      'checkBundleDiscount',
      { code: 'LAUNCH30' },
      {
        responseStatus: {
          isSuccess: false,
          errors: [
            {
              message: 'This discount code was already used.',
              errorCode: 'CM-ERRORS-ACCOUNT-027',
              context: { reason: 'already_used' },
            },
          ],
        },
      },
      400,
    );
    const out = (await result) as {
      error?: { status: number; errorCode?: string; errors: Array<{ meta?: unknown }> };
    };
    expect(out.error?.status).toBe(400);
    expect(out.error?.errorCode).toBe('CM-ERRORS-ACCOUNT-027');
    expect(out.error?.errors[0]?.meta).toMatchObject({ reason: 'already_used' });
  });
});
