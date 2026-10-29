import { expect, it } from 'vitest';
import { templateSchema, templates } from '../design/templates.schema.js';
import { darkTemplateVariants } from './default-templates.js';

it('provides contrast-validated dark palettes for both existing profiles', () => {
  for (const key of ['saas-modern-light', 'erp-compact'] as const) {
    expect(templateSchema.safeParse(darkTemplateVariants[key]).success).toBe(true);
    expect(darkTemplateVariants[key].spacing).toEqual(templates[key].spacing);
    expect(darkTemplateVariants[key].radius).toBe(templates[key].radius);
  }
});
