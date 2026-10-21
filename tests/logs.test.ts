import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiLogs } from '../src/hooks/api/logs.js';
import { hubLogs } from '../src/hooks/hub/logs.js';

/**
 * The logs hooks — every `norbix.hub.logs` method (15) and `norbix.api.logs`
 * writeLogs. The hooks are a 1:1 wrapper: each reaches its SDK method with the
 * caller's arguments, is a query or a mutation, and carries its cache tags.
 * The last describe drives the real `@norbix.ai/ts` client with a fake fetch —
 * never a real server.
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
  providesTags?: unknown[];
  invalidatesTags?: unknown[];
};

/** hook name → [kind, tags it provides (query) or invalidates (mutation)]. */
const HUB: Record<string, ['query' | 'mutation', string[]]> = {
  disableLogging: ['mutation', ['Logs']],
  enableLogging: ['mutation', ['Logs']],
  deleteLoggingIntegration: ['mutation', ['LogsIntegrations']],
  disableLoggingIntegration: ['mutation', ['LogsIntegrations']],
  enableLoggingIntegration: ['mutation', ['LogsIntegrations']],
  getLoggingIntegration: ['query', ['LogsIntegrations']],
  getLoggingIntegrations: ['query', ['LogsIntegrations']],
  saveLoggingIntegration: ['mutation', ['LogsIntegrations']],
  testLoggingIntegration: ['mutation', ['LogsIntegrations']],
  getLogsByCorrelationId: ['query', ['Logs']],
  getLogs: ['query', ['Logs']],
  getLog: ['query', ['Logs']],
  cleanLogs: ['mutation', ['Logs']],
  getLogSettings: ['query', ['LogsSettings']],
  saveLogSettings: ['mutation', ['LogsSettings']],
};
const NAMES = Object.keys(HUB);

const hub = hubLogs(fakeBuilder()) as unknown as Record<string, Def>;
const api = apiLogs(fakeBuilder()) as unknown as Record<string, Def>;

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const logs = Object.fromEntries([...NAMES, 'writeLogs'].map((n) => [n, record(n)]));
  return { calls, client: { hub: { logs }, api: { logs } } };
}

describe('hubLogs', () => {
  it('covers all 15 logs endpoints of the core SDK', () => {
    expect(Object.keys(hub).sort()).toEqual([...NAMES].sort());
    const sdk = Object.keys(new Norbix({ apiKey: 'k', projectId: 'p' }).hub.logs)
      .filter((k) => k !== 'transport')
      .sort();
    expect(sdk).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();
    const args = { id: 'log_1' };
    await hub[key]!.query(args)(client);
    expect(calls).toEqual([{ method: key, args }]);
  });

  it.each(NAMES)('%s is a %s with its tags', (key) => {
    const [kind, tags] = HUB[key]!;
    expect(hub[key]!.__kind).toBe(kind);
    expect(kind === 'query' ? hub[key]!.providesTags : hub[key]!.invalidatesTags).toEqual(tags);
  });
});

describe('apiLogs', () => {
  it('writeLogs is a mutation on norbix.api.logs that invalidates Logs', async () => {
    const { calls, client } = fakeNorbix();
    const args = { entries: [{ title: 'Order paid' }] };
    await api['writeLogs']!.query(args)(client);
    expect(calls).toEqual([{ method: 'writeLogs', args }]);
    expect(api['writeLogs']!.__kind).toBe('mutation');
    expect(api['writeLogs']!.invalidatesTags).toEqual(['Logs']);
  });
});

/**
 * Through the real `@norbix.ai/ts` client and this package's base query with a
 * fake fetch: verb, host, route and body.
 */
describe('logs hooks through the real SDK (fake fetch)', () => {
  function run(
    def: Def,
    args: unknown,
    answer: { status: number; body: unknown; headers?: Record<string, string> } = {
      status: 200,
      body: { responseStatus: { isSuccess: true } },
    },
  ) {
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{ url: string; method: string; body: string | undefined }> = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        body: typeof init?.body === 'string' ? init.body : undefined,
      });
      return new globalThis.Response(JSON.stringify(answer.body), {
        status: answer.status,
        headers: { 'Content-Type': 'application/json', ...answer.headers },
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
    const result = baseQuery(def.query(args) as never, {} as never, {}) as Promise<{
      data?: unknown;
      error?: Record<string, unknown>;
    }>;
    return { seen, result };
  }

  it('getLog sends GET /v2/logs/<id> on the Hub', async () => {
    const { seen, result } = run(hub['getLog']!, { id: '66b2f0a1c3d4e5f6a7b8c9d0' });
    expect((await result).error).toBeUndefined();
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/logs/66b2f0a1c3d4e5f6a7b8c9d0');
  });

  it('saveLogSettings sends only the given setting', async () => {
    const { seen, result } = run(hub['saveLogSettings']!, { aiChatLoggingEnabled: true });
    expect((await result).error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/logs/settings');
    expect(JSON.parse(seen[0]!.body!)).toEqual({ aiChatLoggingEnabled: true });
  });

  it('cleanLogs sends POST /v2/logs/clean', async () => {
    const { seen, result } = run(hub['cleanLogs']!, {});
    expect((await result).error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/logs/clean');
  });

  it('writeLogs sends POST /v2/logs on the Api host with the entries', async () => {
    const entries = [
      {
        title: 'Order paid',
        level: 'information',
        eventCode: 'order:paid',
        meta: { orderId: 'o1' },
      },
    ];
    const { seen, result } = run(
      api['writeLogs']!,
      { entries },
      { status: 200, body: { accepted: 1 } },
    );
    expect((await result).data).toEqual({ accepted: 1 });
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe('https://api.norbix.io/v2/logs');
    expect(JSON.parse(seen[0]!.body!)).toEqual({ entries });
  });

  it('writeLogs on a 429 gives an error with retryAfterSeconds', async () => {
    const { seen, result } = run(
      api['writeLogs']!,
      { entries: [{ title: 'x' }] },
      {
        status: 429,
        body: {
          responseStatus: {
            isSuccess: false,
            errors: [{ errorCode: 'CM-ERRORS-LOGGING-003', message: 'Log quota used up' }],
          },
        },
        headers: { 'Retry-After': '12' },
      },
    );
    const { error } = await result;
    expect(seen).toHaveLength(1);
    expect(error?.['httpStatus']).toBe(429);
    expect(error?.['errorCode']).toBe('CM-ERRORS-LOGGING-003');
    expect(error?.['retryAfterSeconds']).toBe(12);
  });
});
