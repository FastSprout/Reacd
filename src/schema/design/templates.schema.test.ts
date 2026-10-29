import { describe, expect, it } from 'vitest';
import { templateSchema, templates } from '../../index.js';
import { contrastRatio } from '../../templates.js';

describe('design tokens', () => {
  it.each(Object.entries(templates))(
    'validates all tokens and contrast pairs for %s',
    (_id, template) => {
      expect(templateSchema.parse(template)).toEqual(template);
    },
  );

  it('calculates symmetric contrast across both luminance branches', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    expect(contrastRatio('#ffffff', '#000000')).toBe(21);
    expect(contrastRatio('#111111', '#111111')).toBe(1);
    expect(contrastRatio('#777777', '#ffffff')).toBeLessThan(4.5);
  });

  it('rejects tokens that can inject CSS or change protected layout behavior', () => {
    const template = templates['saas-modern-light'];
    for (const input of [
      { ...template, colors: { ...template.colors, text: 'red;position:fixed' } },
      { ...template, radius: -1 },
      { ...template, fontSize: 0.1 },
      { ...template, font: 'url(https://example.com/font)' },
      { ...template, shadow: '0 0 0 9999px red' },
      { ...template, css: 'body{}' },
    ])
      expect(templateSchema.safeParse(input).success).toBe(false);
  });

  it('accepts the largest allowed design scale without granting layout control', () => {
    expect(
      templateSchema.safeParse({
        ...templates['saas-modern-light'],
        spacing: { small: 4, medium: 4, large: 4 },
        radius: 4,
        fontSize: 1.25,
      }).success,
    ).toBe(true);
  });

  it('rejects low contrast and both ways spacing can be unordered', () => {
    const template = templates['saas-modern-light'];
    expect(
      templateSchema.safeParse({
        ...template,
        colors: { ...template.colors, text: '#ffffff' },
      }).success,
    ).toBe(false);
    expect(
      templateSchema.safeParse({
        ...template,
        spacing: { small: 2, medium: 1, large: 3 },
      }).success,
    ).toBe(false);
    expect(
      templateSchema.safeParse({
        ...template,
        spacing: { small: 0, medium: 3, large: 1 },
      }).success,
    ).toBe(false);
  });
});
