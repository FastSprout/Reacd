import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdRenderer } from './renderer.js';
import { GenerativeUI } from '../generative-ui/generative-ui.js';

it('forwards controlled pressed state from both transport versions to the SDK',
  async () => {
    const mono = vi.fn();
    const root = { type: 'Button', label: 'Mono', action: 'mono' } as const;
    const legacy = { schemaVersion: '0.1', templateId: 'saas-modern-light' };
    const current = { schemaVersion: '0.2', state: [] };
    const view = render(<ReacdRenderer adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...legacy, root: { ...root, pressed: false } }} />);
    const button = screen.getByRole('button', { name: 'Mono', pressed: false });
    await userEvent.click(button);
    expect(mono).toHaveBeenCalledExactlyOnceWith({ values: {} });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    view.rerender(<ReacdRenderer adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...legacy, root: { ...root, pressed: true } }} />);
    expect(screen.getByRole('button', { name: 'Mono', pressed: true })).toBe(button);
    view.rerender(<ReacdRenderer adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...legacy, root }} />);
    expect(button).not.toHaveAttribute('aria-pressed');
    view.rerender(<GenerativeUI adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...current, root: { ...root, pressed: false } }} />);
    expect(screen.getByRole('button', { name: 'Mono', pressed: false })).toBeVisible();
    view.rerender(<GenerativeUI adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...current, root: { ...root, pressed: true } }} />);
    expect(screen.getByRole('button', { name: 'Mono', pressed: true })).toBeVisible();
    view.rerender(<GenerativeUI adapter={shadcnAdapter} actions={{ mono }}
      document={{ ...current, root }} />);
    expect(screen.getByRole('button', { name: 'Mono' }))
      .not.toHaveAttribute('aria-pressed');
  },
);
