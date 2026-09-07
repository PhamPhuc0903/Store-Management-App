import { describe, expect, it } from 'vitest';
import { validateEnvironment } from './validate-environment';

describe('validateEnvironment', () => {
  it('normalizes API_PORT from an environment string to a number', () => {
    const environment = validateEnvironment({ API_PORT: '3100' });
    expect(environment.API_PORT).toBe(3100);
  });
  it('uses the default API port when API_PORT is absent', () => {
    const environment = validateEnvironment({});
    expect(environment.API_PORT).toBe(3001);
  });
  it('reject an invalid API port', () => {
    expect(() => validateEnvironment({ API_PORT: 'not-a-port' })).toThrow(
      'API_PORT must be an integer between 1 and 65535.',
    );
  });
});
