import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from '../../generative.js';
import { createStateRegistry } from '../registry/state-registry.js';

it('visits Card slots and preserves their nested state and actions', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state: [
          { key: 'title', kind: 'text', initial: 'Card heading', access: 'read' },
        ],
        root: {
          type: 'Card',
          label: 'Grouped record',
          children: [],
          header: [{ type: 'Text', content: { state: 'title', mode: 'read' } }],
          footer: [{ type: 'Button', label: 'Confirm record', action: 'confirm' }],
        },
      }}
      actions={{ confirm: action }}
    />,
  );
  expect(screen.getByRole('region', { name: 'Grouped record' })).toBeVisible();
  expect(screen.getByText('Card heading')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Confirm record' }));
  expect(action).toHaveBeenCalledOnce();
});

it('protects loading actions and supports named or decorative icons', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state: [],
        root: {
          type: 'VStack',
          children: [
            { type: 'Icon', name: 'add', label: 'Add record' },
            { type: 'Icon', name: 'check', decorative: true },
            {
              type: 'Button',
              label: 'Save',
              loading: true,
              loadingLabel: 'Saving record',
              leadingIcon: 'check',
              action: 'save',
            },
          ],
        },
      }}
      actions={{ save: action }}
    />,
  );
  expect(screen.getByRole('img', { name: 'Add record' })).toBeVisible();
  const button = screen.getByRole('button', { name: 'Saving record' });
  expect(button).toBeDisabled();
  await user.click(button);
  expect(action).not.toHaveBeenCalled();
});

it('keeps nullable progress in range and dismisses controlled alerts', async () => {
  const user = userEvent.setup();
  const definitions = [
    { key: 'progress', kind: 'nullableNumber', initial: null, access: 'readWrite' },
    { key: 'notice', kind: 'boolean', initial: true, access: 'readWrite' },
  ];
  const created = createStateRegistry(definitions);
  if (!created.success) throw new Error('Progress test registry failed.');
  const registry = created.data;
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      registry={registry}
      document={{
        schemaVersion: '0.2',
        state: definitions,
        root: {
          type: 'VStack',
          children: [
            {
              type: 'Progress',
              label: 'Work',
              max: 10,
              value: { state: 'progress', mode: 'read' },
            },
            { type: 'Progress', label: 'Pending', value: null },
            { type: 'Progress', label: 'Unknown' },
            {
              type: 'Alert',
              title: 'Notice',
              message: 'Review needed',
              intent: 'info',
              open: { state: 'notice', mode: 'readWrite' },
              closeLabel: 'Dismiss notice',
            },
          ],
        },
      }}
    />,
  );
  const progress = screen.getByRole('progressbar', { name: 'Work' });
  expect(progress).not.toHaveAttribute('aria-valuenow');
  act(() => {
    registry.update('progress', 5);
  });
  expect(progress).toHaveAttribute('aria-valuenow', '5');
  expect(progress).toHaveAttribute('aria-valuemax', '10');
  expect(registry.update('progress', 11).success).toBe(false);
  await user.click(screen.getByRole('button', { name: 'Dismiss notice' }));
  expect(screen.queryByText('Review needed')).toBeNull();
});
