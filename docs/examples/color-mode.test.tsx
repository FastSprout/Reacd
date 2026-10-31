import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import {
  createReacdStore,
  ReacdProvider,
  darkTemplateVariants,
} from '@fastsprout/reacd';
import { templateAtom } from '../../src/state/theme/template.atom.js';
import { ColorModeExample } from './color-mode.js';

it.each(['saas-modern-light', 'erp-compact'] as const)(
  'runs %s light/dark/system templates while retaining draft state',
  async (profile) => {
    const user = userEvent.setup();
    const store = createReacdStore();
    store.set(templateAtom, profile);
    const view = render(
      <ReacdProvider adapter={shadcnAdapter} store={store}>
        <ColorModeExample />
      </ReacdProvider>,
    );
    const draft = screen.getByRole('textbox', { name: 'Palette draft' });
    fireEvent.change(draft, { target: { value: 'Retained draft' } });
    await user.click(screen.getByRole('button', { name: 'Dark appearance button' }));
    expect(screen.getByText('Color preference: dark; resolved: dark')).toBeVisible();
    expect(draft).toBe(screen.getByRole('textbox', { name: 'Palette draft' }));
    expect(draft).toHaveValue('Retained draft');
    const theme = view.container.querySelector('.reacd-theme');
    if (!(theme instanceof HTMLElement)) throw new Error('Missing theme scope.');
    expect(theme.style.getPropertyValue('--reacd-text')).toBe(
      darkTemplateVariants[profile].colors.text,
    );
    await user.click(screen.getByRole('switch', { name: 'Dark appearance switch' }));
    expect(screen.getByText('Color preference: light; resolved: light')).toBeVisible();
    const select = screen.getByRole('combobox', { name: 'Color preference' });
    await user.click(select);
    await user.click(await screen.findByRole('option', { name: /^Dark$/ }));
    await waitFor(() => expect(select).toHaveAttribute('aria-expanded', 'false'));
    await user.click(select);
    await user.click(await screen.findByRole('option', { name: /^System$/ }));
    await waitFor(() => expect(select).toHaveAttribute('aria-expanded', 'false'));
    expect(screen.getByText('Color preference: system; resolved: light')).toBeVisible();
    await user.click(screen.getByRole('switch', { name: 'Right to left appearance' }));
    expect(view.container.querySelector('.reacd-app')).toHaveAttribute('dir', 'rtl');
    await user.click(screen.getByRole('switch', { name: 'Read-only appearance' }));
    await user.click(screen.getByRole('button', { name: 'Dark appearance button' }));
    expect(screen.getByText('Color preference: system; resolved: light')).toBeVisible();
  },
);
