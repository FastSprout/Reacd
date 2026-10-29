import { expect, it } from 'vitest';
import { CHAT_CONTRAST_TEMPLATE } from '../../../test-support/chat-contrast.js';
import { DESIGN_POLICY } from '../../core/policy.js';
import { contrastRatio, templateSchema } from '../design/templates.schema.js';

it('accepts valid endpoint colors whose interpolation would fail contrast', () => {
  expect(templateSchema.safeParse(CHAT_CONTRAST_TEMPLATE).success).toBe(true);
  const { colors } = CHAT_CONTRAST_TEMPLATE;
  for (const foreground of [colors.text, colors.muted])
    expect(contrastRatio(foreground, colors.surface)).toBeGreaterThanOrEqual(
      DESIGN_POLICY.minTextContrast,
    );
  expect(contrastRatio('#808080', colors.surface)).toBeLessThan(
    DESIGN_POLICY.minTextContrast,
  );
});
