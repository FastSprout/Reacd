import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SiteApplication } from '../site.js';
import { sitePayload } from '../../../../test-support/site-payload.js';
import {
  DEFAULT_DESIGN_PREFERENCES,
  resolveDesignTemplate,
} from '../../design/preferences.js';

it(
  'restores before removing startup tokens and persists native theme choices',
  async () => {
  const user = userEvent.setup();
  const preferences = { ...DEFAULT_DESIGN_PREFERENCES, primary: 'blue' } as const;
  const persistDesign = vi.fn();
  const appearanceReady = vi.fn(() => {
    const toggle = screen.getByRole('button', {
      name: 'Toggle dark appearance',
    });
    expect(toggle.closest('[data-adapter]')).toHaveStyle({
      '--primary': resolveDesignTemplate(preferences, 'dark').colors.primary,
    });
  });
  render(
    <SiteApplication
      payload={sitePayload}
      actions={{
        copyText: async () => undefined,
        readAppearance: () => 'dark',
        persistAppearance: vi.fn(),
        readDesign: () => preferences,
        persistDesign,
        appearanceReady,
      }}
    />,
  );
  await waitFor(() => expect(appearanceReady).toHaveBeenCalledOnce());
  appearanceReady.mockImplementation(() => undefined);
  await user.click(screen.getByRole('button', { name: 'Customize theme' }));
  await user.click(screen.getByRole('combobox', { name: 'Primary color' }));
  await user.click(screen.getByRole('option', { name: 'Green' }));
  expect(persistDesign).toHaveBeenLastCalledWith({
    ...preferences,
    primary: 'green',
  });
  await user.click(screen.getByRole('button', { name: 'Reset theme' }));
  expect(persistDesign).toHaveBeenLastCalledWith(DEFAULT_DESIGN_PREFERENCES);
});
