import type { PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createMaterialTheme } from '../src/adapter/mui/surface/theme.js';
import { templates } from '../src/schema/design/templates.schema.js';

const material = createMaterialTheme(templates['saas-modern-light']);

export function ActiveTestTheme({ children }: PropsWithChildren) {
  return process.env['REACD_TEST_ADAPTER'] === 'mui' ? (
    <ThemeProvider theme={material}>{children}</ThemeProvider>
  ) : (
    children
  );
}
