import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReacdProvider } from '@fastsprout/reacd';
import { expect, it, vi } from 'vitest';
import { DEFAULT_DESIGN_PREFERENCES } from '../../design/preferences.js';
import { ThemeCustomizer } from './theme-customizer.js';

it(
  'keeps native theme settings visible while applying changes',
  async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <ReacdProvider>
      <ThemeCustomizer preferences={DEFAULT_DESIGN_PREFERENCES} onChange={onChange} />
    </ReacdProvider>,
  );
  const opener = screen.getByRole('button', { name: 'Customize theme' });
  await user.click(opener);
  expect(screen.getByRole('dialog', { name: 'Customize theme' })).toBeVisible();
  await user.click(screen.getByRole('combobox', { name: 'Theme preset' }));
  await user.click(screen.getByRole('option', { name: 'Cobalt' }));
  expect(onChange).toHaveBeenLastCalledWith({
    primary: 'blue', neutral: 'zinc', font: 'system', radius: 'small',
    density: 'comfortable',
  });
  for (const [label, option, key, value] of [
    ['Primary color', 'Blue', 'primary', 'blue'],
    ['Neutral color', 'Slate', 'neutral', 'slate'],
    ['Font family', 'System', 'font', 'system'],
    ['Corner radius', 'Small', 'radius', 'small'],
    ['Density', 'Compact', 'density', 'compact'],
  ] as const) {
    await user.click(screen.getByRole('combobox', { name: label }));
    await user.click(screen.getByRole('option', { name: option }));
    expect(onChange).toHaveBeenLastCalledWith({
      ...DEFAULT_DESIGN_PREFERENCES,
      [key]: value,
    });
  }
  await user.click(screen.getByRole('button', { name: 'Reset theme' }));
  expect(onChange).toHaveBeenLastCalledWith(DEFAULT_DESIGN_PREFERENCES);
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(opener).toHaveFocus();
});
