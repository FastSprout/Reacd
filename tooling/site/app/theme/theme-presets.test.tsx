import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DEFAULT_DESIGN_PREFERENCES } from '../../design/preferences.js';
import { THEME_PRESETS } from '../../design/presets.js';
import { ThemePresets } from './theme-presets.js';

it('offers every complete theme with one native button activation', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  const view = render(<ReacdProvider>
    <ThemePresets preferences={DEFAULT_DESIGN_PREFERENCES}
      appearance="dark" onChange={onChange} />
  </ReacdProvider>);
  expect(screen.getByRole('group', { name: 'Theme preset' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Default theme' }))
    .toHaveAttribute('aria-pressed', 'true');
  for (const preset of THEME_PRESETS) {
    const button = screen.getByRole('button', {
      name: `${preset.label} theme`,
    });
    await user.click(button);
    expect(onChange).toHaveBeenLastCalledWith(preset.preferences);
  }
  const cobalt = THEME_PRESETS.find(preset => preset.key === 'cobalt');
  if (!cobalt) throw new Error('Missing Cobalt preset.');
  view.rerender(<ReacdProvider>
    <ThemePresets preferences={cobalt.preferences}
      appearance="light" onChange={onChange} />
  </ReacdProvider>);
  expect(screen.getByRole('button', { name: 'Cobalt theme' }))
    .toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Default theme' }))
    .toHaveAttribute('aria-pressed', 'false');
});

it('shows Custom for individual changes and retains native keyboard activation',
  async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ReacdProvider>
      <ThemePresets preferences={{ ...DEFAULT_DESIGN_PREFERENCES, radius: 'none' }}
        appearance="light" onChange={onChange} />
    </ReacdProvider>);
    expect(screen.getByText('Custom theme')).toBeVisible();
    const sky = screen.getByRole('button', { name: 'Sky theme' });
    sky.focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledOnce();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(2);
  });
