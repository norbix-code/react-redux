import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubNotifications } from '../src/hooks/hub/notifications.js';

/**
 * The SMS hooks — all 35 SMS Hub endpoints of the core SDK. The hooks are a
 * 1:1 wrapper, so the contract is: the hook reaches the right SDK method with
 * the caller's arguments, is a query or a mutation as expected, and carries
 * the cache tags the dashboard relies on. No HTTP here except the last
 * describe, which drives the real `@norbix.ai/ts` client with a fake fetch —
 * never a real server, never a real provider.
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

/** name → [kind, tag] — the tag is what the hook provides or invalidates. */
const SMS: Record<string, ['query' | 'mutation', string | undefined]> = {
  // module
  enableSms: ['mutation', 'Sms'],
  disableSms: ['mutation', 'Sms'],
  getSmsDisableDependencies: ['query', 'Sms'],
  getSmsSettings: ['query', 'SmsSettings'],
  previewSmsNotification: ['query', 'Sms'],
  // integrations
  getSmsIntegrations: ['query', 'SmsIntegrations'],
  getSmsIntegration: ['query', 'SmsIntegrations'],
  saveSmsIntegration: ['mutation', 'SmsIntegrations'],
  testSmsIntegration: ['mutation', 'SmsIntegrations'],
  confirmSmsIntegrationHumanDelivery: ['mutation', 'SmsIntegrations'],
  deleteSmsIntegration: ['mutation', 'SmsIntegrations'],
  setSmsIntegrationAsDefault: ['mutation', 'SmsIntegrations'],
  enableSmsIntegration: ['mutation', 'SmsIntegrations'],
  disableSmsIntegration: ['mutation', 'SmsIntegrations'],
  // templates
  getSmsTemplates: ['query', 'SmsTemplates'],
  getSmsTemplate: ['query', 'SmsTemplates'],
  createSmsTemplate: ['mutation', 'SmsTemplates'],
  updateSmsTemplate: ['mutation', 'SmsTemplates'],
  deleteSmsTemplate: ['mutation', 'SmsTemplates'],
  archiveSmsTemplate: ['mutation', 'SmsTemplates'],
  unArchiveSmsTemplate: ['mutation', 'SmsTemplates'],
  cloneSmsTemplate: ['mutation', 'SmsTemplates'],
  getSmsMessageContentTokens: ['query', 'Sms'],
  renderSms: ['mutation', undefined],
  // campaigns
  getSmsCampaigns: ['query', 'SmsCampaigns'],
  createSmsCampaign: ['mutation', 'SmsCampaigns'],
  getSmsCampaign: ['query', 'SmsCampaigns'],
  deleteSmsCampaign: ['mutation', 'SmsCampaigns'],
  stopSmsCampaign: ['mutation', 'SmsCampaigns'],
  getSmsCampaignStatistics: ['query', 'SmsCampaigns'],
  getSmsCampaignBatches: ['query', 'SmsCampaigns'],
  getSmsCampaignBatchNotifications: ['query', 'SmsCampaigns'],
  getSmsCampaignBatchNotification: ['query', 'SmsCampaigns'],
  getSmsCampaignMessages: ['query', 'SmsCampaigns'],
  getSmsCampaignMessage: ['query', 'SmsCampaigns'],
};
const NAMES = Object.keys(SMS);

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const notifications = Object.fromEntries(NAMES.map((n) => [n, record(n)]));
  return { calls, client: { hub: { notifications } } };
}

const endpoints = hubNotifications(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubNotifications — SMS', () => {
  it('covers all 35 SMS endpoints of the core SDK', () => {
    const smsKeys = Object.keys(endpoints).filter((k) => /Sms/.test(k));
    expect(NAMES).toHaveLength(35);
    expect(smsKeys.sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();
    const args = { id: 'cmp_1', campaignId: 'cmp_1', notificationId: 'n_1' };

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: key, args }]);
  });

  it.each(NAMES)('%s is the expected kind and carries the expected tag', (key) => {
    const [kind, tag] = SMS[key]!;
    const def = endpoints[key]!;
    expect(def.__kind).toBe(kind);
    if (kind === 'query') {
      expect(def.providesTags).toEqual([tag]);
    } else if (tag === undefined) {
      // renderSms saves nothing on the server, so nothing in the cache is
      // stale; it is a mutation only so a render is never served from cache.
      expect(def.invalidatesTags).toBeUndefined();
    } else {
      expect(def.invalidatesTags).toEqual([tag]);
    }
  });
});

/**
 * The three hooks this item added, driven through the real `@norbix.ai/ts`
 * client and this package's base query with a fake fetch. Proves the whole
 * chain: verb, route with the id substituted in the gateway's spelling,
 * project scope headers, and the answer landing in `data`.
 */
describe('stop / disable-dependencies / render through the real SDK (fake fetch)', () => {
  function run(key: string, args: unknown, status: number, body: unknown) {
    // Only globalThis.* here: the lint config declares no DOM globals.
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{
      url: string;
      method: string;
      body: string | undefined;
      headers: InstanceType<typeof globalThis.Headers>;
    }> = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        body: typeof init?.body === 'string' ? init.body : undefined,
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
    const call = endpoints[key]!.query(args);
    const result = baseQuery(call as never, {} as never, {});
    return { seen, result };
  }

  it('stopSmsCampaign sends POST /v2/notifications/sms/campaigns/<id>/stop with the project scope', async () => {
    const { seen, result } = run('stopSmsCampaign', { id: 'cmp_1' }, 200, {
      responseStatus: { isSuccess: true },
    });

    const out = (await result) as { data?: unknown; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/notifications/sms/campaigns/cmp_1/stop');
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('X-CM-ProjectId')).toBe('test-project');
  });

  it('getSmsDisableDependencies sends GET /v2/notifications/sms/disable-dependencies and parses the answer', async () => {
    const answer = { campaigns: [{ id: 'cmp_1', name: 'sms-sdk-secondary-c1' }], integrations: [] };
    const { seen, result } = run('getSmsDisableDependencies', {}, 200, {
      ...answer,
      responseStatus: { isSuccess: true },
    });

    const out = (await result) as { data?: typeof answer; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/notifications/sms/disable-dependencies');
    expect(out.data?.campaigns.map((c) => c.id)).toEqual(['cmp_1']);
  });

  it('renderSms sends POST /v2/notifications/sms/templates/render with the code and tokens', async () => {
    const { seen, result } = run(
      'renderSms',
      { code: 'Hi @Model.FirstName', tokens: [{ name: 'FirstName', value: 'Ada' }] },
      200,
      { text: 'Hi Ada', responseStatus: { isSuccess: true } },
    );

    const out = (await result) as { data?: { text?: string }; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe('https://hub.norbix.io/v2/notifications/sms/templates/render');
    expect(seen[0]!.body).toContain('"code":"Hi @Model.FirstName"');
    expect(seen[0]!.body).toContain('"value":"Ada"');
    expect(out.data?.text).toBe('Hi Ada');
  });

  it('a gateway refusal of the stop comes back as the usual serialized error', async () => {
    const { result } = run('stopSmsCampaign', { id: 'cmp_1' }, 400, {
      responseStatus: { errorCode: 'CM-ERRORS-SMS-001', message: 'Campaign is already stopped' },
    });

    const out = (await result) as { data?: unknown; error?: unknown };

    expect(out.data).toBeUndefined();
    expect(out.error).toMatchObject({
      status: 400,
      code: 'CM-ERRORS-SMS-001',
      message: 'Campaign is already stopped',
    });
  });
});
