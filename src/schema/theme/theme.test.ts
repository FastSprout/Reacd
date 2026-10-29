import { describe, expect, it } from 'vitest';
import { themeSchema } from './theme.schema.js';
import { templates } from '../design/templates.schema.js';

describe('scoped theme contract', () => {
  it('accepts a validated template and closed component defaults', () => {
    expect(
      themeSchema.safeParse({
        template: templates['saas-modern-light'],
        defaults: { Button: { intent: 'secondary' }, Text: { role: 'caption' } },
      }).success,
    ).toBe(true);
  });

  it('rejects raw styling, behavior injection and invalid templates', () => {
    for (const value of [
      { defaults: { Text: { style: {} } } },
      { defaults: { Button: { onPress: () => undefined } } },
      { defaults: { Unknown: {} } },
      { template: {} },
      { className: 'custom' },
    ])
      expect(themeSchema.safeParse(value).success).toBe(false);
  });
});
