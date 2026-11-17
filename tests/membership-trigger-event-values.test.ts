import { describe, expect, it } from 'vitest';

import { hubMembership } from '../src/hooks/hub/membership.js';

/**
 * Membership trigger event values (core SDK 4.67.0): a read-only query, 1:1
 * with `norbix.hub.membership.getMembershipTriggerEventValues`, cached with the
 * triggers.
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
};

const endpoints = hubMembership(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubMembership — trigger event values', () => {
  it('getMembershipTriggerEventValues is a query that reaches the SDK method unchanged', async () => {
    const calls: Array<{ method: string; args: unknown }> = [];
    const membership = {
      getMembershipTriggerEventValues: (args: unknown) => {
        calls.push({ method: 'getMembershipTriggerEventValues', args });
        return Promise.resolve({ result: { events: [] } });
      },
    };
    const def = endpoints['getMembershipTriggerEventValues']!;

    await def.query({})({ hub: { membership } });

    expect(calls).toEqual([{ method: 'getMembershipTriggerEventValues', args: {} }]);
    expect(def.__kind).toBe('query');
    expect(def.providesTags).toEqual(['Triggers']);
  });
});
