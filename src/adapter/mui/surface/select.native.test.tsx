import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { templates } from '../../../schema/design/templates.schema.js';
import { MuiSelect } from '../select/select.adapter.js';
import { createMaterialTheme } from './theme.js';

it('lets the native Select grow with wrapped selected text', () => {
  const label = 'Local placeholder image';
  render(
    <ThemeProvider theme={createMaterialTheme(templates['saas-modern-light'])}>
      <MuiSelect
        label="Avatar source"
        value="local"
        items={[{ value: 'local', label }]}
        onValueChange={() => undefined}
      />
    </ThemeProvider>,
  );
  const control = screen.getByRole('combobox', { name: 'Avatar source' });
  expect(control).toHaveTextContent(label);
  expect(control).toHaveStyle({ height: 'auto', whiteSpace: 'normal' });
  expect(getComputedStyle(control).display).not.toBe('-webkit-box');
});
