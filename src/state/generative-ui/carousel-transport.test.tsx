import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: 'slide', kind: 'number', initial: 0, access: 'readWrite' },
    { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
  ],
  root: {
    type: 'Carousel',
    label: 'Generated slides',
    value: { state: 'slide', mode: 'readWrite' },
    retryAction: 'retry',
    items: [
      {
        id: 'first',
        label: 'First',
        children: [{ type: 'Text', content: 'First content' }],
      },
      {
        id: 'second',
        label: 'Second',
        children: [
          { type: 'Button', label: 'Nested action', action: 'run' },
          {
            type: 'Marquee',
            label: 'Generated notices',
            paused: { state: 'paused', mode: 'readWrite' },
            items: [{ id: 'notice', label: 'Notice' }],
          },
        ],
      },
    ],
  },
});

it('renders recursive transport and registers inactive child constraints', async () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  const registry = createDocumentState(document);
  const user = userEvent.setup();
  const run = vi.fn();
  const retry = vi.fn();
  render(
    <GenerativeUI document={document} registry={registry} actions={{ run, retry }} />,
  );
  expect(screen.getByText('First content')).toBeVisible();
  expect(registry.update('slide', 2).success).toBe(false);
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(success(registry.read('slide')).value).toBe(1);
  await user.click(screen.getByRole('button', { name: 'Nested action' }));
  expect(run).toHaveBeenCalledWith({ state: registry });
  await user.click(screen.getByRole('button', { name: 'Resume movement' }));
  expect(success(registry.read('paused')).value).toBe(false);
  act(() => {
    registry.update('slide', 0);
  });
  expect(screen.getByText('First content')).toBeVisible();
  vi.unstubAllGlobals();
});

it('validates actions and bindings even in initially inactive slides', () => {
  const view = render(
    <GenerativeUI document={document} actions={{ retry: vi.fn() }} />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: run');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<GenerativeUI document={document} actions={{ run: vi.fn() }} />);
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: retry');
  expect(
    validateGenerativeDocument({
      ...document,
      state: [{ key: 'slide', kind: 'number', initial: 0, access: 'readWrite' }],
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...document,
      state: [
        { key: 'slide', kind: 'number', initial: 2, access: 'readWrite' },
        { key: 'paused', kind: 'boolean', initial: true, access: 'readWrite' },
      ],
    }).success,
  ).toBe(false);
});
