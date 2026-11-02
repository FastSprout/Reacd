import { userEvent } from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import type { Root } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { UnsupportedAdapterComponentError } from '@fastsprout/reacd';

const captured = vi.hoisted(() => {
  const roots: Root[] = [];
  const errors: unknown[] = [];
  return { roots, errors };
});
vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom/client')>();
  return { ...actual, createRoot(
    container: Parameters<typeof actual.createRoot>[0],
    options: Parameters<typeof actual.createRoot>[1],
  ) {
    const root = actual.createRoot(container, { ...options,
      onCaughtError: (error: unknown) => { captured.errors.push(error); } });
    captured.roots.push(root);
    return root;
  } };
});
let host: HTMLElement | undefined;
beforeAll(() => window.localStorage.setItem('reacd-conformance-adapter', 'mui'));
afterAll(() => window.localStorage.clear());
afterEach(async () => {
  await act(async () => { captured.roots.forEach((root) => root.unmount()); });
  captured.roots.length = 0;
  captured.errors.length = 0;
  host?.remove();
  host = undefined;
  vi.restoreAllMocks();
});

it('isolates unsupported Popover without erasing native form and tab proofs',
  async () => {
    host = document.createElement('div');
    host.id = 'root';
    document.body.append(host);
    await act(async () => {
      await import('../../../test-support/browser/composition-safety.js');
    });
    const combo = await screen.findByRole('combobox', { name: 'Role' });
    expect(combo.className).toContain('MuiSelect-select');
    expect(captured.errors).toHaveLength(1);
    expect(captured.errors[0]).toBeInstanceOf(UnsupportedAdapterComponentError);
    expect(captured.errors[0]).toMatchObject({ adapterId: 'material-ui',
      componentName: 'Popover' });
    expect(screen.getByText('Cannot load Shared tab popup')).toBeVisible();
    await userEvent.click(combo);
    await userEvent.click(screen.getByRole('option', { name: 'Admin' }));
    expect(screen.getByText('Accepted role edits: 1')).toBeVisible();
    await userEvent.click(screen.getByRole('switch', {
      name: 'Disable settings form',
    }));
    const form = screen.getByRole('form', { name: 'Settings' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
    expect([...new FormData(form)]).toEqual([]);
    await userEvent.click(screen.getByRole('switch', {
      name: 'Disable settings form',
    }));
    await userEvent.click(screen.getByRole('switch', { name: 'Submit settings form' }));
    expect([...new FormData(form)]).toEqual([['role', 'admin']]);
    expect(screen.getByRole('tab', { name: 'First' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Native ancestry rejection' }))
      .toHaveTextContent('Forms cannot be nested');
  },
);
