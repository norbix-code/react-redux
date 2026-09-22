import { describe, expect, it } from 'vitest';

import { serializeNorbixError } from '../src/errors.js';

describe('serializeNorbixError', () => {
  it('preserves NorbixError-shaped fields, under both name sets', () => {
    const out = serializeNorbixError({
      status: 422,
      code: 'NORBIX_VALIDATION_ERROR',
      message: 'Invalid email',
      fieldErrors: [{ fieldName: 'email', message: 'must be email' }],
      url: 'https://api.norbix.ai/v2/membership/users',
    });
    expect(out).toEqual({
      status: 422,
      httpStatus: 422,
      code: 'NORBIX_VALIDATION_ERROR',
      errorCode: 'NORBIX_VALIDATION_ERROR',
      message: 'Invalid email',
      fieldErrors: [{ fieldName: 'email', message: 'must be email' }],
      errors: [{ fieldName: 'email', message: 'must be email' }],
      url: 'https://api.norbix.ai/v2/membership/users',
    });
  });

  /**
   * `httpStatus`, `errorCode` and `errors` are getters on the SDK's
   * NorbixError — they live on the prototype, so a spread would lose them.
   * The serializer reads them by name, which is what this pins.
   */
  it('reads the cross-SDK names when only those are present', () => {
    const out = serializeNorbixError({
      httpStatus: 200,
      errorCode: 'CM-ERRORS-FILES-016',
      message: 'File not found',
      errors: [{ errorCode: 'CM-ERRORS-FILES-016', message: 'File not found' }],
    });
    expect(out.status).toBe(200);
    expect(out.httpStatus).toBe(200);
    expect(out.code).toBe('CM-ERRORS-FILES-016');
    expect(out.errorCode).toBe('CM-ERRORS-FILES-016');
    expect(out.fieldErrors).toHaveLength(1);
    expect(out.errors).toHaveLength(1);
  });

  it('falls back to status 0 when missing', () => {
    const out = serializeNorbixError({ message: 'whoops' });
    expect(out.status).toBe(0);
    expect(out.httpStatus).toBe(0);
    expect(out.fieldErrors).toEqual([]);
    expect(out.errors).toEqual([]);
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
