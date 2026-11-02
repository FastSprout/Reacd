import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { expect, it, vi } from 'vitest';
import { templates } from '../../../schema/design/templates.schema.js';
import { MuiApp } from '../app/app.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiInputNumber } from '../input-number/input-number.adapter.js';
import { MuiRadioGroup } from '../radio-group/radio-group.adapter.js';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiSelect } from '../select/select.adapter.js';
import { createMaterialTheme } from './theme.js';

it('contains native RTL field ink inline while keeping floating labels visible',
  async () => {
    const change = vi.fn<(value: string) => void>();
    render(
      <ThemeProvider theme={createMaterialTheme(templates['saas-modern-light'])}>
        <MuiApp direction="rtl">
          <MuiInput label="Palette draft" value="Draft" onValueChange={change} />
        </MuiApp>
      </ThemeProvider>,
    );
    const input = screen.getByRole('textbox', { name: 'Palette draft' });
    const field = input.closest('.MuiTextField-root');
    if (!(field instanceof HTMLElement)) throw new Error('Expected native field.');
    expect(getComputedStyle(field).overflowX).toBe('clip');
    expect(getComputedStyle(field).overflowY).toBe('visible');
    expect(screen.getByText('Palette draft', { selector: 'label' })).toBeVisible();
    await userEvent.type(input, 'x');
    expect(change).toHaveBeenLastCalledWith('Draftx');
  },
);

it('contains standalone Select labels without clipping the native popup', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <ThemeProvider theme={createMaterialTheme(templates['saas-modern-light'])}>
      <MuiApp direction="rtl">
        <MuiSelect label="Color preference" value="light" onValueChange={change}
          items={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
        />
      </MuiApp>
    </ThemeProvider>,
  );
  const select = screen.getByRole('combobox', { name: 'Color preference' });
  const field = select.closest('.MuiFormControl-root');
  if (!(field instanceof HTMLElement)) throw new Error('Expected native control.');
  expect(getComputedStyle(field).overflowX).toBe('clip');
  expect(getComputedStyle(field).overflowY).toBe('visible');
  await userEvent.click(select);
  const popup = screen.getByRole('listbox');
  expect(popup).toBeVisible();
  expect(field.contains(popup)).toBe(false);
  await userEvent.click(screen.getByRole('option', { name: 'Dark' }));
  expect(change).toHaveBeenCalledWith('dark');
});

it('preserves the named hit target on compact native radio labels', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <ThemeProvider theme={createMaterialTheme(templates['erp-compact'])}>
      <MuiRadioGroup label="Roles" value="reader" onValueChange={change}
        items={[{ value: 'reader', label: 'Reader' }]} />
    </ThemeProvider>,
  );
  const label = screen.getByRole('radio', { name: 'Reader' }).closest('label');
  if (!label) throw new Error('Expected native radio label.');
  expect(getComputedStyle(label).minHeight)
    .toBe(`${LAYOUT_POLICY.controlTargetPx}px`);
  await userEvent.click(label);
  const radio = screen.getByRole('radio', { name: 'Reader' });
  if (!(radio instanceof HTMLInputElement)) throw new Error('Expected native radio.');
  expect(radio.checked).toBe(true);
});

it('keeps compact native number input roots at the named target size', () => {
  render(
    <ThemeProvider theme={createMaterialTheme(templates['erp-compact'])}>
      <MuiInputNumber label="Quantity" value={0.1} onValueChange={() => undefined} />
    </ThemeProvider>,
  );
  const root = screen.getByRole('textbox', { name: 'Quantity' })
    .closest('.MuiOutlinedInput-root');
  if (!(root instanceof HTMLElement)) throw new Error('Expected native number root.');
  expect(getComputedStyle(root).minHeight)
    .toBe(`${LAYOUT_POLICY.controlTargetPx}px`);
});
