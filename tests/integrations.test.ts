import { describe, expect, it, vi } from 'vitest';

import { buildIntegrationsEndpoints } from '../src/helpers/integrations.js';

/**
 * Mock builder that records what each endpoint definition was called with.
 * RTK Query's actual builder is internally complex; for unit tests we just
 * need to confirm the helper produces the right keys and shape.
 */
function fakeBuilder() {
  const calls: Array<{ kind: 'query' | 'mutation'; def: unknown }> = [];
  return {
    calls,
    builder: {
      query: (def: unknown) => {
        calls.push({ kind: 'query', def });
        return def;
      },
      mutation: (def: unknown) => {
        calls.push({ kind: 'mutation', def });
        return def;
      },
    } as never,
  };
}

describe('buildIntegrationsEndpoints', () => {
  it('produces the standard 7 keys for the default include', () => {
    const { builder } = fakeBuilder();

    const endpoints = buildIntegrationsEndpoints(builder, {
      prefix: 'Email',
      tag: 'EmailIntegrations',
      namespace: () => ({}),
      include: { test: true },
    });

    expect(Object.keys(endpoints).sort()).toEqual(
      [
        'getEmailIntegrations',
        'getEmailIntegration',
        'saveEmailIntegration',
        'deleteEmailIntegration',
        'enableEmailIntegration',
        'disableEmailIntegration',
        'setEmailIntegrationAsDefault',
        'testEmailIntegration',
      ].sort(),
    );
  });

  it('omits test when include.test === false', () => {
    const { builder } = fakeBuilder();

    const endpoints = buildIntegrationsEndpoints(builder, {
      prefix: 'Database',
      tag: 'DatabaseIntegrations',
      namespace: () => ({}),
      include: { test: false },
    });

    expect(Object.keys(endpoints)).not.toContain('testDatabaseIntegration');
  });

  it('adds confirmHumanDelivery when opted in', () => {
    const { builder } = fakeBuilder();

    const endpoints = buildIntegrationsEndpoints(builder, {
      prefix: 'Email',
      tag: 'EmailIntegrations',
      namespace: () => ({}),
      include: { test: true, confirmHumanDelivery: true },
    });

    expect(Object.keys(endpoints)).toContain('confirmEmailIntegrationHumanDelivery');
  });

  it('respects methodNames overrides for non-conventional SDK names', () => {
    const { builder } = fakeBuilder();

    const endpoints = buildIntegrationsEndpoints(builder, {
      prefix: 'Logs',
      tag: 'LogsIntegrations',
      namespace: () => ({}),
      methodNames: { list: 'getLoggingIntegrations', save: 'saveLoggingIntegration' },
      include: { test: false },
    });

    // Default name `getLogsIntegrations` should NOT be there; the override wins.
    expect(Object.keys(endpoints)).toContain('getLoggingIntegrations');
    expect(Object.keys(endpoints)).toContain('saveLoggingIntegration');
    expect(Object.keys(endpoints)).not.toContain('getLogsIntegrations');
    expect(Object.keys(endpoints)).not.toContain('saveLogsIntegration');
  });

  it('routes calls through the namespace function', async () => {
    const getDatabaseIntegrations = vi.fn().mockResolvedValue({ list: [] });
    const namespace = vi.fn().mockReturnValue({ getDatabaseIntegrations });

    const { builder, calls } = fakeBuilder();
    buildIntegrationsEndpoints(builder, {
      prefix: 'Database',
      tag: 'DatabaseIntegrations',
      namespace,
      include: { test: false },
    });

    // The first recorded call should be the list-query definition.
    const listCall = calls[0];
    expect(listCall.kind).toBe('query');
    const def = listCall.def as { query: (args: unknown) => (n: unknown) => Promise<unknown> };

    // Run the closure against a fake norbix; should route to the right method.
    await def.query({ projectId: 'proj_1' })({ token: 'fake' } as never);

    expect(namespace).toHaveBeenCalledWith({ token: 'fake' });
    expect(getDatabaseIntegrations).toHaveBeenCalledWith({ projectId: 'proj_1' });
  });

  it('rejects with a clear error if the SDK is missing the method', async () => {
    const namespace = () => ({}); // no methods at all

    const { builder, calls } = fakeBuilder();
    buildIntegrationsEndpoints(builder, {
      prefix: 'Email',
      tag: 'EmailIntegrations',
      namespace,
      include: { test: false },
    });

    const def = calls[0].def as { query: (args: unknown) => (n: unknown) => Promise<unknown> };
    await expect(def.query({})({} as never)).rejects.toThrow(/SDK method "getEmailIntegrations" not found/);
  });
});
