import { expect, it } from 'vitest';
import { templates } from '../../../schema/design/templates.schema.js';
import { darkTemplateVariants } from '../../../schema/color-mode/default-templates.js';
import { shadcnThemeVariables } from './theme-variables.js';

it('uses the same SDK tokens for initial paint and live surfaces', () => {
  const light = shadcnThemeVariables(templates['saas-modern-light']);
  const dark = shadcnThemeVariables(darkTemplateVariants['saas-modern-light']);
  const compact = shadcnThemeVariables(templates['erp-compact']);
  expect(Object.keys(dark)).toEqual(Object.keys(light));
  expect(light['--background']).toBe('#ffffff');
  expect(dark['--background']).toBe('#0a0a0a');
  expect(dark['--foreground']).toBe('#fafafa');
  expect(dark['--popover']).toBe('#171717');
  expect(light['--sdk-shadow']).toBe('initial');
  expect(compact['--sdk-shadow']).toBe('0 0 #0000');
  expect(dark['--space-medium']).toBe(light['--space-medium']);
});
