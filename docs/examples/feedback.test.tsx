import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { installLayout } from '../../test-support/layout-observer.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReacdProvider } from '@fastsprout/reacd';
import { UserExample } from './user.js';
import { ProgressGroupExample } from './progress-group.js';
import { BannerExample } from './banner.js';

let restoreLayout: () => void;
beforeEach(() => {
  restoreLayout = installLayout();
});
afterEach(() => restoreLayout());

describe('documented feedback examples', () => {
  it('controls identity orientation, disabled actions and action count', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <UserExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Ada Lovelace' }));
    expect(screen.getByText('Profile actions: 1')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Vertical identity' }));
    await user.click(screen.getByRole('switch', { name: 'Right to left identity' }));
    expect(
      screen.getByRole('button', { name: 'Ada Lovelace' }).closest('[dir]'),
    ).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('button', { name: 'Ada Lovelace' })).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    await user.click(screen.getByRole('switch', { name: 'Disable profile action' }));
    expect(screen.getByRole('button', { name: 'Ada Lovelace' })).toBeDisabled();
    await user.click(screen.getByRole('switch', { name: 'Vertical identity' }));
    expect(screen.getByRole('link', { name: 'Read the User guide' })).toHaveAttribute(
      'href',
      '/components/user/',
    );
    await user.clear(screen.getByLabelText('User name', { exact: true }));
    await user.type(screen.getByLabelText('User description'), 'Architect');
  });
  it('updates segmented storage using keyboard and toggles the total', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <ProgressGroupExample />
      </ReacdProvider>,
    );
    const slider = await screen.findByRole('slider', { name: /^Application storage/u });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '41');
    await user.click(screen.getByRole('switch', { name: 'Show storage total' }));
    expect(screen.queryByText('41 / 128')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Right to left segments' }));
    expect(screen.getByRole('progressbar').closest('[dir]')).toHaveAttribute(
      'dir',
      'rtl',
    );
    await user.clear(screen.getByLabelText('Progress segment label'));
    await user.type(screen.getByLabelText('Progress segment label'), 'Apps');
    expect(screen.getByText('Apps')).toBeInTheDocument();
  });
  it('runs banner actions, closes through state and restores visibility', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <BannerExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Save example work' }));
    expect(screen.getByText('Example saves: 1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(screen.queryByRole('alert')).toBeNull();
    await user.click(screen.getByRole('switch', { name: 'Show maintenance banner' }));
    await user.click(screen.getByRole('switch', { name: 'Allow banner dismissal' }));
    expect(screen.queryByRole('button', { name: 'Dismiss banner' })).toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByRole('switch', { name: 'Right to left banner' }));
    expect(screen.getByRole('alert').closest('[dir]')).toHaveAttribute('dir', 'rtl');
    await user.clear(screen.getByLabelText('Banner title', { exact: true }));
    await user.type(screen.getByLabelText('Banner description'), 'Save soon.');
  });
});
