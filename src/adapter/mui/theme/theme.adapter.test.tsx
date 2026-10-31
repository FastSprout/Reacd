import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { expect, it } from 'vitest';
import { templates } from '../../../schema/design/templates.schema.js';
import { MuiTheme } from './theme.adapter.js';
import { MuiApp } from '../app/app.adapter.js';
import { MuiButtonPrimitive } from '../primitives/button/button.js';
import { createMaterialTheme } from '../surface/theme.js';

function Palette({ label }: { readonly label: string }) {
  const theme = useTheme();
  return (
    <output aria-label={label}>
      {`${theme.palette.primary.main} ${theme.direction}`}
    </output>
  );
}

it('isolates nested Material themes and inherits the application direction', () => {
  const outer = templates['saas-modern-light'];
  const inner = templates['erp-compact'];
  render(
    <ThemeProvider theme={createMaterialTheme(outer)}>
      <MuiApp direction="rtl">
        <MuiTheme>
          <Palette label="Inherited" />
        </MuiTheme>
        <MuiTheme template={inner}>
          <Palette label="Nested" />
          <MuiButtonPrimitive>Compact action</MuiButtonPrimitive>
        </MuiTheme>
      </MuiApp>
      <Palette label="Outer" />
    </ThemeProvider>,
  );
  expect(screen.getByLabelText('Inherited')).toHaveTextContent(
    `${outer.colors.primary} rtl`,
  );
  expect(screen.getByLabelText('Nested')).toHaveTextContent(
    `${inner.colors.primary} rtl`,
  );
  expect(screen.getByLabelText('Outer')).toHaveTextContent(
    `${outer.colors.primary} ltr`,
  );
  expect(screen.getByRole('button').className).toContain('MuiButton-sizeSmall');
});
