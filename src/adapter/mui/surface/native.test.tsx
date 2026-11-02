import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { expect, it } from 'vitest';
import { templates } from '../../../schema/design/templates.schema.js';
import { MuiSurface } from './surface.adapter.js';
function ThemeProbe() {
  const theme = useTheme();
  return <Typography>{theme.palette.primary.main}</Typography>;
}
it('provides the native Material theme and scoped CSS baseline', () => {
  const view = render(
    <MuiSurface template={templates['erp-compact']} templateId="erp-compact">
      <ThemeProbe />
    </MuiSurface>,
  );
  expect(screen.getByText(templates['erp-compact'].colors.primary)).toBeVisible();
  expect(view.container.querySelector('.MuiScopedCssBaseline-root')).not.toBeNull();
  expect(view.container.querySelector('[data-adapter="material-ui"]')).toHaveAttribute(
    'data-template',
    'erp-compact',
  );
});
