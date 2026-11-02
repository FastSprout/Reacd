import { act, fireEvent, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { Root } from 'react-dom/client';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import { NATIVE_MODULE_IMPORT_TIMEOUT_MS } from
  '../../../test-support/native-module-policy.js';
import { UnsupportedAdapterComponentError } from '@fastsprout/reacd';

const captured = vi.hoisted(() => {
  const roots: Root[] = [];
  const errors: unknown[] = [];
  return { roots, errors };
});
vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom/client')>();
  return {
    ...actual,
    createRoot(
      host: Parameters<typeof actual.createRoot>[0],
      options: Parameters<typeof actual.createRoot>[1],
    ) {
      const root = actual.createRoot(host, {
        ...options,
        onCaughtError: (error: unknown) => {
          captured.errors.push(error);
        },
      });
      captured.roots.push(root);
      return root;
    },
  };
});
let host: HTMLElement | undefined;
afterAll(async () => {
  await act(async () => {
    captured.roots.forEach((root) => root.unmount());
  });
  host?.remove();
  window.localStorage.clear();
});

beforeAll(async () => {
  window.localStorage.setItem('reacd-conformance-adapter', 'mui');
  host = document.createElement('div');
  host.id = 'root';
  document.body.append(host);
  await act(async () => {
    await import('../../../test-support/temporal-recovery-browser.js');
  });
}, NATIVE_MODULE_IMPORT_TIMEOUT_MS);

it('isolates unsupported MUI proofs and preserves date recovery', async () => {
  if (!host) throw new Error('Expected the actual temporal entry host.');
  expect(host.querySelector('[data-adapter]')).toHaveAttribute(
    'data-adapter',
    'material-ui',
  );
  expect(captured.errors).toHaveLength(3);
  for (const error of captured.errors) {
    expect(error).toBeInstanceOf(UnsupportedAdapterComponentError);
    expect(error).toMatchObject({ adapterId: 'material-ui' });
  }
  expect(captured.errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ componentName: 'InputDate' }),
      expect.objectContaining({ componentName: 'InputTime' }),
    ]),
  );
  for (const label of ['Date range recovery', 'Time range recovery', 'Time recovery'])
    expect(screen.getByText(`Cannot load ${label}`)).toBeVisible();
  const proof = within(screen.getByRole('region', { name: 'date recovery proof' }));
  expect(proof.getByRole('group', { name: 'date recovery' })).toBeVisible();
  const month = proof.getByRole('spinbutton', { name: 'Month' });
  month.focus();
  await userEvent.keyboard('{ArrowUp}');
  fireEvent.click(proof.getByRole('button', { name: 'Save' }));
  expect(proof.getByRole('status', { name: 'Recovery saved' })).toHaveTextContent('0');
  fireEvent.click(proof.getByRole('button', { name: 'Replace' }));
  fireEvent.click(proof.getByRole('button', { name: 'Refresh' }));
  fireEvent.click(proof.getByRole('button', { name: 'Save' }));
  await vi.waitFor(() =>
    expect(
      proof.getByRole('status', {
        name: 'Recovery saved',
      }),
    ).toHaveTextContent('1'),
  );
  expect(proof.getByRole('status', { name: 'Recovery writes' })).toHaveTextContent('0');
  expect(proof.getByRole('status', { name: 'Refresh count' })).toHaveTextContent('1');
  for (const kind of ['date', 'time']) {
    const range = within(screen.getByRole('region', { name: `${kind} reset proof` }));
    for (const name of [
      'Replace',
      'Toggle decline',
      'Toggle readonly',
      'Toggle disabled',
      'Save',
    ])
      fireEvent.click(range.getByRole('button', { name }));
    expect(range.getByRole('status', { name: 'Range writes' })).toHaveTextContent('[]');
    expect(range.getByRole('status', { name: 'Range saved' })).toHaveTextContent('{}');
  }
  fireEvent.click(screen.getByRole('button', { name: 'Switch template' }));
  fireEvent.click(screen.getByRole('button', { name: 'Switch template' }));
});
