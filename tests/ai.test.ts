import { describe, expect, it } from 'vitest';

import { apiAi } from '../src/hooks/api/ai.js';
import { hubAccount } from '../src/hooks/hub/account.js';
import { hubAi } from '../src/hooks/hub/ai.js';

/**
 * Same fake builder and fake client the files tests use: the hooks are a 1:1
 * wrapper, so "it reached the right SDK method with my arguments and the
 * right cache tag" is the whole contract. No HTTP, no server, no provider.
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

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const mod = (prefix: string, names: string[]) =>
    Object.fromEntries(names.map((n) => [n, record(`${prefix}.${n}`)]));
  const client = {
    api: {
      ai: mod('api.ai', [
        'getEndUserChatAvailability',
        'listEndUserChatSessions',
        'createEndUserChatSession',
        'getEndUserChatSession',
        'renameEndUserChatSession',
        'deleteEndUserChatSession',
        'pinEndUserChatSession',
        'archiveEndUserChatSession',
        'getEndUserChatEntries',
        'setEndUserChatEntryFeedback',
        'listEndUserChatAttachments',
        'uploadEndUserChatAttachment',
        'deleteEndUserChatAttachment',
        'listEndUserChatMemory',
        'forgetEndUserChatMemory',
        'startEndUserChatTurn',
      ]),
    },
    hub: {
      account: mod('hub.account', [
        'getProjectAiSettings',
        'updateProjectAiSettings',
        'createProjectAiAssistant',
        'updateProjectAiAssistant',
        'deleteProjectAiAssistant',
        'getProjectAiUsage',
        'setAdminPortalEnabled',
      ]),
      ai: mod('hub.ai', [
        'getEmbeddingIntegrations',
        'saveEmbeddingIntegration',
        'getEmbeddingIntegration',
        'deleteEmbeddingIntegration',
        'testEmbeddingIntegration',
        'setLlmIntegrationAsDefault',
      ]),
    },
  };
  return { calls, client };
}

const HUB_ACCOUNT = [
  'getProjectAiSettings',
  'updateProjectAiSettings',
  'createProjectAiAssistant',
  'updateProjectAiAssistant',
  'deleteProjectAiAssistant',
  'getProjectAiUsage',
  'setAdminPortalEnabled',
] as const;
const HUB_AI = [
  'getEmbeddingIntegrations',
  'saveEmbeddingIntegration',
  'getEmbeddingIntegration',
  'deleteEmbeddingIntegration',
  'testEmbeddingIntegration',
  'setLlmIntegrationAsDefault',
] as const;
const API_AI = [
  'getEndUserChatAvailability',
  'listEndUserChatSessions',
  'createEndUserChatSession',
  'getEndUserChatSession',
  'renameEndUserChatSession',
  'deleteEndUserChatSession',
  'pinEndUserChatSession',
  'archiveEndUserChatSession',
  'getEndUserChatEntries',
  'setEndUserChatEntryFeedback',
  'listEndUserChatAttachments',
  'uploadEndUserChatAttachment',
  'deleteEndUserChatAttachment',
  'listEndUserChatMemory',
  'forgetEndUserChatMemory',
  'startEndUserChatTurn',
] as const;
const QUERIES = new Set([
  'getProjectAiSettings',
  'getProjectAiUsage',
  'getEmbeddingIntegrations',
  'getEmbeddingIntegration',
  'getEndUserChatAvailability',
  'listEndUserChatSessions',
  'getEndUserChatSession',
  'getEndUserChatEntries',
  'listEndUserChatAttachments',
  'listEndUserChatMemory',
]);

describe('wave-3 AI hooks', () => {
  it.each([
    ['hub.account', hubAccount, HUB_ACCOUNT, 'Projects'],
    ['hub.ai', hubAi, HUB_AI, 'Ai'],
    ['api.ai', apiAi, API_AI, 'AiChat'],
  ] as const)(
    '%s: every method is wired 1:1 with the right kind and tag',
    async (prefix, factory, names, tag) => {
      const defs = factory(fakeBuilder()) as unknown as Record<string, Def>;
      const { calls, client } = fakeNorbix();
      for (const name of names) {
        const def = defs[name];
        expect(def, name).toBeDefined();
        const isQuery = QUERIES.has(name);
        expect(def!.__kind, name).toBe(isQuery ? 'query' : 'mutation');
        expect(isQuery ? def!.providesTags : def!.invalidatesTags, name).toEqual([tag]);
        const args = { probe: name };
        await def!.query(args)(client);
        expect(calls.at(-1), name).toEqual({ method: `${prefix}.${name}`, args });
      }
      expect(calls).toHaveLength(names.length);
    },
  );

  it('covers the 29 wave-3 routes', () => {
    expect(HUB_ACCOUNT.length + HUB_AI.length + API_AI.length).toBe(29);
  });
});
