import { describe, expect, it } from 'vitest';

import { serializeNorbixError } from '../src/errors.js';

describe('serializeNorbixError', () => {
  it('preserves NorbixError-shaped fields', () => {
    const out = serializeNorbixError({
      status: 422,
      code: 'NORBIX_VALIDATION_ERROR',
      message: 'Invalid email',
      fieldErrors: [{ fieldName: 'email', message: 'must be email' }],
      url: 'https://api.norbix.ai/v2/membership/users',
    });
    expect(out).toEqual({
      status: 422,
      code: 'NORBIX_VALIDATION_ERROR',
      message: 'Invalid email',
      fieldErrors: [{ fieldName: 'email', message: 'must be email' }],
      url: 'https://api.norbix.ai/v2/membership/users',
    });
  });

  it('falls back to status 0 when missing', () => {
    const out = serializeNorbixError({ message: 'whoops' });
    expect(out.status).toBe(0);
    expect(out.fieldErrors).toEqual([]);
  });

  it('handles plain string throws', () => {
    expect(serializeNorbixError('boom')).toMatchObject({ status: 0, message: 'boom' });
  });

  it('handles undefined throws gracefully', () => {
    expect(serializeNorbixError(undefined)).toMatchObject({
      status: 0,
      message: 'Unknown Norbix error',
    });
  });
});
