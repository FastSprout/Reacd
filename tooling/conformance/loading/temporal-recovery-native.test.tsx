import { act, fireEvent, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { Root } from 'react-dom/client';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => {
  const roots: Root[] = [];
  return { roots };
});
vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom/client')>();
  return { ...actual, createRoot(
    host: Parameters<typeof actual.createRoot>[0],
    options: Parameters<typeof actual.createRoot>[1],
  ) {
    const root = actual.createRoot(host, options);
    captured.roots.push(root);
    return root;
  } };
});
let host: HTMLElement | undefined;
afterAll(async () => {
  await act(async () => { captured.roots.forEach((root) => root.unmount()); });
  host?.remove();
});

beforeAll(async () => {
  host = document.createElement('div');
  host.id = 'root';
  document.body.append(host);
  await act(async () => {
    await import('../../../test-support/temporal-recovery-browser.js');
  });
  expect(host.querySelector('[data-adapter]'))
    .toHaveAttribute('data-adapter', 'shadcn-ui');
});

it.each(['date', 'time'])('keeps %s host reset atomic and protected', async (kind) => {
  const user = userEvent.setup();
  const initial = kind === 'date'
    ? { start: '2024-01-01', end: '2024-01-05' }
    : { start: '09:00:00', end: '10:00:00' };
  const replacement = kind === 'date'
    ? { start: '2024-02-01', end: '2024-02-05' }
    : { start: '13:00:00', end: '14:00:00' };
  const proof = within(screen.getByRole('region', { name: `${kind} reset proof` }));
  const first = proof.getAllByRole('spinbutton')[0];
  if (!first) throw new Error('Missing native temporal segment.');
  const form = first.closest('form');
  if (!form) throw new Error('Missing native temporal form.');
  await user.click(proof.getByRole('button', { name: `Clear ${kind} range Start` }));
  const cleared = { ...initial, start: null };
  expect(proof.getByRole('status', { name: 'Range value' }))
    .toHaveTextContent(JSON.stringify(cleared));
  await user.click(proof.getByRole('button', { name: 'Replace' }));
  await user.type(proof.getByRole('textbox', { name: `Unrelated ${kind}` }), 'Edit');
  first.focus();
  fireEvent.reset(form);
  expect(first).toHaveFocus();
  expect(proof.getByRole('status', { name: 'Range writes' }))
    .toHaveTextContent(JSON.stringify([cleared, initial]));
  expect(proof.getByRole('textbox', { name: `Unrelated ${kind}` }))
    .toHaveValue('Initial');
  await user.click(proof.getByRole('button', { name: 'Save' }));
  expect(proof.getByRole('status', { name: 'Range saved' }))
    .toHaveTextContent(JSON.stringify({
      'range.start': initial.start, 'range.end': initial.end,
    }));
  await user.click(proof.getByRole('button', { name: 'Replace' }));
  await user.click(proof.getByRole('button', { name: 'Toggle decline' }));
  fireEvent.reset(form);
  expect(proof.getByRole('status', { name: 'Range value' }))
    .toHaveTextContent(JSON.stringify(replacement));
  await user.click(proof.getByRole('button', { name: `Clear ${kind} range Start` }));
  expect(proof.getByRole('status', { name: 'Range value' }))
    .toHaveTextContent(JSON.stringify(replacement));
  const writes = proof.getByRole('status', { name: 'Range writes' }).textContent;
  await user.click(proof.getByRole('button', { name: 'Toggle readonly' }));
  fireEvent.reset(form);
  expect(proof.getByRole('status', { name: 'Range writes' })).toHaveTextContent(
    writes ?? '',
  );
  await user.click(proof.getByRole('button', { name: 'Toggle readonly' }));
  await user.click(proof.getByRole('button', { name: 'Toggle disabled' }));
  fireEvent.reset(form);
  await user.click(proof.getByRole('button', { name: 'Save' }));
  expect(proof.getByRole('status', { name: 'Range saved' })).toHaveTextContent('{}');
  expect(proof.getByRole('status', { name: 'Range writes' }))
    .toHaveTextContent(writes ?? '');
});

it.each(['date', 'time'])('keeps %s native recovery live', async (kind) => {
  const user = userEvent.setup();
  const proof = within(screen.getByRole('region', { name: `${kind} recovery proof` }));
  await user.click(proof.getByRole('button', { name: `Clear ${kind} recovery` }));
  expect(proof.getByRole('status', { name: 'Recovery writes' }))
    .toHaveTextContent('1');
  await user.click(proof.getByRole('button', { name: 'Save' }));
  expect(proof.getByRole('status', { name: 'Recovery saved' }))
    .toHaveTextContent('0');
  await user.click(proof.getByRole('button', { name: 'Replace' }));
  await user.click(proof.getByRole('button', { name: 'Save' }));
  await vi.waitFor(() => expect(proof.getByRole('status', {
    name: 'Recovery saved',
  })).toHaveTextContent('1'));
  await user.click(proof.getByRole('button', { name: 'Refresh' }));
  expect(proof.getByRole('status', { name: 'Refresh count' }))
    .toHaveTextContent('1');
});

it('changes both template directions without replacing the selected SDK', async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Switch template' }));
  await user.click(screen.getByRole('button', { name: 'Switch template' }));
});
