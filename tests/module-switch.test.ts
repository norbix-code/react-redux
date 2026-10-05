import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubDatabase } from '../src/hooks/hub/database.js';
import { hubFiles } from '../src/hooks/hub/files.js';
import { hubLogs } from '../src/hooks/hub/logs.js';
import { hubMembership } from '../src/hooks/hub/membership.js';
import { hubNotifications } from '../src/hooks/hub/notifications.js';
import { hubPayments } from '../src/hooks/hub/payments.js';

/** Same fake builder the other hook tests use: it keeps the definition and its kind. */
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
type Factory = (b: never) => Record<string, unknown>;
type SchemasResponse = Awaited<ReturnType<Norbix['hub']['database']['getDatabaseSchemas']>>;
type SchemaRow = NonNullable<NonNullable<SchemasResponse['list']>['items']>[number];

/**
 * Module switches (gateway refactoringV2, @norbix.ai/ts 4.10.0): every one
 * moved from GET to PUT. `[hook, SDK module, path, tags, hook module]`.
 * hub.code has no hooks in this package, so EnableCode / DisableCode are not listed.
 */
const SWITCHES: Array<[string, string, string, string[], Factory]> = [
  ['enableDatabase', 'database', '/database/enable', ['Database'], hubDatabase],
  ['disableDatabase', 'database', '/database/disable', ['Database'], hubDatabase],
  ['enableFiles', 'files', '/files/enable', ['Files'], hubFiles],
  ['disableFiles', 'files', '/files/disable', ['Files'], hubFiles],
  ['enableLogging', 'logs', '/logs/enable', ['Logs'], hubLogs],
  ['disableLogging', 'logs', '/logs/disable', ['Logs'], hubLogs],
  ['enablePayments', 'payments', '/payments/enable', ['Payments'], hubPayments],
  ['disablePayments', 'payments', '/payments/disable', ['Payments'], hubPayments],
  ['enableMembership', 'membership', '/membership/enable', ['Membership'], hubMembership],
  ['disableMembership', 'membership', '/membership/disable', ['Membership'], hubMembership],
  ['enableEmail', 'notifications', '/notifications/email/enable', ['Emails'], hubNotifications],
  ['disableEmail', 'notifications', '/notifications/email/disable', ['Emails'], hubNotifications],
  ['enableSms', 'notifications', '/notifications/sms/enable', ['Sms'], hubNotifications],
  ['disableSms', 'notifications', '/notifications/sms/disable', ['Sms'], hubNotifications],
  ['enablePush', 'notifications', '/notifications/push/enable', ['Push'], hubNotifications],
  ['disablePush', 'notifications', '/notifications/push/disable', ['Push'], hubNotifications],
];

/**
 * The real `@norbix.ai/ts` client and this package's base query over a fake
 * fetch — never a real server. Records verb, URL and headers of every call.
 */
function realChain(status: number, body: unknown) {
  // Only globalThis.* here: the lint config declares no DOM globals.
  type FetchFn = typeof globalThis.fetch;
  const seen: Array<{
    url: string;
    method: string;
    headers: InstanceType<typeof globalThis.Headers>;
  }> = [];
  const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
    seen.push({
      url: String(input),
      method: (init?.method ?? 'GET').toUpperCase(),
      headers: new globalThis.Headers(init?.headers ?? {}),
    });
    return new globalThis.Response(JSON.stringify(body), {
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
  const run = (def: Def, args: unknown) =>
    baseQuery(def.query(args) as never, {} as never, {}) as Promise<{
      data?: unknown;
      error?: unknown;
    }>;
  return { seen, run };
}

describe('module switch hooks (enable / disable)', () => {
  it.each(SWITCHES)(
    '%s is a mutation that reaches hub.%s and invalidates its module tag',
    (hook, sdkModule, _path, tags, factory) => {
      const def = factory(fakeBuilder())[hook] as Def;
      const calls: string[] = [];
      const client = {
        hub: {
          [sdkModule]: new Proxy(
            {},
            {
              get: (_t, name: string) => (args: unknown) => {
                calls.push(`${name}:${JSON.stringify(args)}`);
                return Promise.resolve({});
              },
            },
          ),
        },
      };

      void def.query({ projectId: 'p1' })(client);

      expect({ kind: def.__kind, calls, invalidates: def.invalidatesTags }).toEqual({
        kind: 'mutation',
        calls: [`${hook}:{"projectId":"p1"}`],
        invalidates: tags,
      });
    },
  );

  it.each(SWITCHES)('%s (hub.%s) sends PUT on the wire', async (hook, _m, path, _t, factory) => {
    const { seen, run } = realChain(200, {});
    const out = await run(factory(fakeBuilder())[hook] as Def, {});

    expect({
      error: out.error,
      calls: seen.map((s) => ({ method: s.method, url: s.url.split('?')[0] })),
    }).toEqual({
      error: undefined,
      calls: [{ method: 'PUT', url: `https://hub.norbix.io/v2${path}` }],
    });
  });
});

describe('schema list per environment', () => {
  const endpoints = hubDatabase(fakeBuilder()) as unknown as Record<string, Def>;

  it('getDatabaseSchemas with env TEST targets TEST and returns rows that carry env', async () => {
    const rows: Partial<SchemaRow>[] = [{ viewId: 'sch_1', schemaName: 'orders', env: 'TEST' }];
    const { seen, run } = realChain(200, { list: { items: rows } });

    const out = (await run(endpoints.getDatabaseSchemas, { env: 'TEST' })) as {
      data?: SchemasResponse;
      error?: unknown;
    };

    const sent = seen[0];
    const envOnWire =
      sent.headers.get('norbix-env') ?? new globalThis.URL(sent.url).searchParams.get('env');
    expect({
      error: out.error,
      method: sent.method,
      url: sent.url.split('?')[0],
      envOnWire,
      rowEnv: out.data?.list?.items?.map((r) => r.env),
    }).toEqual({
      error: undefined,
      method: 'GET',
      url: 'https://hub.norbix.io/v2/database/schemas',
      envOnWire: 'TEST',
      rowEnv: ['TEST'],
    });
  });

  it('list settings for a schema keep env in the arguments, so each environment caches apart', () => {
    const calls: unknown[] = [];
    const client = {
      hub: {
        database: {
          getDatabaseSchemaListSettings: (a: unknown) => (calls.push(a), Promise.resolve({})),
        },
      },
    };

    void endpoints.getDatabaseSchemaListSettings.query({ id: 'orders', env: 'TEST' })(client);
    void endpoints.getDatabaseSchemaListSettings.query({ id: 'orders' })(client);

    expect(calls).toEqual([{ id: 'orders', env: 'TEST' }, { id: 'orders' }]);
  });
});
