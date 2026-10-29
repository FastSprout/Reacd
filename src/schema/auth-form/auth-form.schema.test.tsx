import { describe, expect, it } from 'vitest';
import { authFormSchema } from './auth-form.schema.js';

const base = {
  label: 'Local sign in',
  submitLabel: 'Submit local example',
  onSubmit: () => {},
};

describe('AuthForm contract', () => {
  it('accepts safe composition and rejects open rendering bags', () => {
    expect(authFormSchema.safeParse(base).success).toBe(true);
    for (const extra of [
      { style: {} },
      { className: 'custom' },
      { submit: { label: 'Override' } },
      { onSubmit: 'code' },
      { children: <input /> },
      { error: '' },
      { loadingLabel: '' },
    ]) {
      expect(authFormSchema.safeParse({ ...base, ...extra }).success).toBe(false);
    }
  });

  it('requires unique provider keys and real callbacks', () => {
    const provider = { key: 'local', label: 'Local provider', onPress: () => {} };
    expect(authFormSchema.safeParse({ ...base, providers: [provider] }).success).toBe(
      true,
    );
    expect(
      authFormSchema.safeParse({ ...base, providers: [provider, provider] }).success,
    ).toBe(false);
    expect(
      authFormSchema.safeParse({
        ...base,
        providers: [{ ...provider, onPress: undefined }],
      }).success,
    ).toBe(false);
  });
});
