import { expect, it } from 'vitest';
import { templates } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { createMaterialTheme } from './theme.js';

it.each(['saas-modern-light', 'erp-compact'] as const)(
  'maps the %s template without replacing business declarations',
  (name) => {
    const template = templates[name];
    const theme = createMaterialTheme(template);
    expect(theme.palette.primary.main).toBe(template.colors.primary);
    expect(theme.palette.primary.contrastText).toBe(template.colors.onPrimary);
    expect(theme.palette.error.main).toBe(template.colors.danger);
    expect(theme.palette.background.default).toBe(template.colors.canvas);
    expect(theme.typography.fontFamily).toBe('var(--reacd-font)');
    expect(theme.components?.MuiButtonBase?.defaultProps?.disableRipple).toBe(true);
  },
);

it('derives dark mode from a validated dark canvas', () => {
  const original = templates['saas-modern-light'];
  const theme = createMaterialTheme({
    ...original,
    colors: {
      ...original.colors,
      canvas: '#000000',
      surface: '#111111',
      text: '#ffffff',
      muted: '#cccccc',
    },
  });
  expect(theme.palette.mode).toBe('dark');
});
