import { createTheme } from '@mui/material/styles';
import { expect, it } from 'vitest';
import { materialSpacing } from './spacing.js';
import { createMaterialTheme } from '../surface/theme.js';
import { templates } from '../../../schema/design/templates.schema.js';
it('maps named spacing through the native theme metadata', () => {
  expect(materialSpacing(createTheme())).toBe('1rem');
  expect(materialSpacing(createMaterialTheme(templates['erp-compact']), 'large')).toBe(
    '1rem',
  );
});
