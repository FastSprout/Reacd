import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { expect, it } from 'vitest';
import { templates } from '../../../schema/design/templates.schema.js';
import { MuiTheme } from './theme.adapter.js';
function Color() {
  return <Typography>{useTheme().palette.primary.main}</Typography>;
}
it('provides nested templates through Material ThemeProvider', () => {
  const view = render(
    <MuiTheme template={templates['erp-compact']}>
      <Color />
    </MuiTheme>,
  );
  expect(screen.getByText(templates['erp-compact'].colors.primary)).toBeVisible();
  view.rerender(
    <MuiTheme>
      <Color />
    </MuiTheme>,
  );
  expect(screen.getByText('#1976d2')).toBeVisible();
});
