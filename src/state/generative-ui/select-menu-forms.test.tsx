import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';

const items = [{ value: '42', label: 'Answer' }];

it.each(['single', 'multiple'])('validates readonly generative mode %s', (mode) => {
  const state = [
    {
      key: 'selected',
      kind: mode === 'single' ? 'text' : 'selection',
      initial: mode === 'single' ? '' : [],
      access: 'readWrite',
    },
  ];
  const registry = createStateRegistry(state);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <form aria-label="Generative record form">
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          schemaVersion: '0.2',
          state,
          root: {
            type: 'SelectMenu',
            label: 'Read records',
            name: 'records',
            mode,
            items,
            required: true,
            value: { state: 'selected', mode: 'read' },
          },
        }}
        registry={registry.data}
      />
    </form>,
  );
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('combobox', { name: 'Read records' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
  act(() => {
    expect(
      registry.data.update('selected', mode === 'single' ? '42' : ['42']).success,
    ).toBe(true);
  });
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form))).toEqual([['records', '42']]);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
});
