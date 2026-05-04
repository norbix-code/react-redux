import { render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NorbixProvider, useNorbix, useOptionalNorbix } from '../src/provider.js';

const fakeClient = { id: 'fake-norbix' } as never;

describe('<NorbixProvider> + useNorbix', () => {
  it('exposes the client to descendants via useNorbix()', () => {
    const { result } = renderHook(() => useNorbix(), {
      wrapper: ({ children }) => (
        <NorbixProvider client={fakeClient}>{children}</NorbixProvider>
      ),
    });
    expect(result.current).toBe(fakeClient);
  });

  it('throws when useNorbix() is called outside a provider', () => {
    expect(() => renderHook(() => useNorbix())).toThrow(
      /must be called inside <NorbixProvider/,
    );
  });

  it('useOptionalNorbix returns null outside a provider', () => {
    const { result } = renderHook(() => useOptionalNorbix());
    expect(result.current).toBeNull();
  });

  it('renders children', () => {
    const { getByText } = render(
      <NorbixProvider client={fakeClient}>
        <span>hello</span>
      </NorbixProvider>,
    );
    expect(getByText('hello')).toBeTruthy();
  });
});
