import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SelectMenuExample } from './select-menu.js';

it('runs documented single/multiple forms and canonical selection output', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Primary record' }));
  await user.click(await screen.findByRole('option', { name: /Answer/ }));
  await user.click(screen.getByRole('button', { name: 'Save primary record' }));
  expect(screen.getByText('Single record saved.')).toBeInTheDocument();
  expect(screen.getByText('Single key: 42')).toBeInTheDocument();
  await user.click(screen.getByRole('combobox', { name: 'Related records' }));
  await user.click(await screen.findByRole('option', { name: /Answer/ }));
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  await user.click(screen.getByRole('button', { name: 'Save related records' }));
  expect(screen.getByText('Multiple records saved.')).toBeInTheDocument();
  expect(screen.getByText('Multiple keys: 42, beta')).toBeInTheDocument();
});

it('runs both explicit selection vetoes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Decline selection' }));
  for (const label of ['Primary record', 'Related records']) {
    const trigger = screen.getByRole('combobox', { name: label });
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: /Answer/ }));
    expect(screen.getByRole('listbox')).toBeVisible();
    expect(trigger).not.toHaveTextContent('Answer');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox', { hidden: true })).toBeNull();
    });
  }
  expect(screen.getByText('Single key:')).toBeInTheDocument();
  expect(screen.getByText('Multiple keys:')).toBeInTheDocument();
});

it('runs status and independent access controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  for (const label of ['Loading records', 'Choices unavailable'])
    await user.click(screen.getByRole('switch', { name: label }));
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  for (const label of [
    'Loading records',
    'Choices unavailable',
    'Read-only selection',
    'Read-only search',
    'Disable selection',
  ])
    await user.click(screen.getByRole('switch', { name: label }));
  expect(screen.getByRole('combobox', { name: 'Primary record' })).toBeDisabled();
});

it('keeps selected labels across external filtering and runs scoped RTL', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Primary record' }));
  await user.click(await screen.findByRole('option', { name: /Answer/ }));
  await user.click(screen.getByRole('switch', { name: 'External Beta results' }));
  await user.click(screen.getByRole('combobox', { name: 'Primary record' }));
  expect(await screen.findByRole('option', { name: 'Beta' })).toBeVisible();
  expect(screen.queryByRole('option', { name: /Answer/ })).toBeNull();
  await user.keyboard('{Escape}');
  expect(screen.getByRole('combobox', { name: 'Primary record' })).toHaveTextContent(
    'Answer',
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left selection' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left selection' }));
});

it('restores history and shares nested selection', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  await user.click(
    screen.getByRole('button', { name: 'Restore unavailable selection' }),
  );
  expect(screen.getByText('Single key: unavailable')).toBeInTheDocument();
  expect(screen.getByText('Multiple keys: unavailable')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Open nested selection' }));
  await user.click(screen.getByRole('combobox', { name: 'Dialog records' }));
  await user.click(await screen.findByRole('option', { name: 'Beta' }));
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.getByText('Single key: beta')).toBeInTheDocument();
});
