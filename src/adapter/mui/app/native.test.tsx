import { render, screen } from '@testing-library/react';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { expect, it } from 'vitest';
import { MuiApp } from './app.adapter.js';
function Direction() {
  return <Typography>{useTheme().direction}</Typography>;
}
it('sets native Material theme direction and document-language scope', () => {
  render(
    <MuiApp direction="rtl" language="ar">
      <Direction />
    </MuiApp>,
  );
  const label = screen.getByText('rtl');
  expect(label.closest('[dir]')).toHaveAttribute('dir', 'rtl');
  expect(label.closest('[lang]')).toHaveAttribute('lang', 'ar');
});

it('uses the default native direction and language without changing children', () => {
  render(
    <MuiApp>
      <Direction />
    </MuiApp>,
  );
  expect(screen.getByText('ltr').closest('[lang]')).toHaveAttribute('lang', 'en');
});
