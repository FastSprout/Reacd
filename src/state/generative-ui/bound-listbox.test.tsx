import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundListbox } from './bound-listbox.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'b', label: 'Beta' },
];
const node = {
  type: 'Listbox',
  label: 'Broad',
  items,
  value: { state: 'choice', mode: 'readWrite' },
} as const;

it('constrains shared writes, vetoes refused requests and recovers', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'choice', kind: 'text', initial: '42', access: 'readWrite' },
    ]),
  );
  const view = render(
    <ReacdProvider>
      <BoundListbox node={node} registry={registry} />
      <BoundListbox
        node={{
          ...node,
          label: 'Narrow',
          items: [{ value: '42', label: 'Answer' }],
          readOnly: false,
          value: { state: 'choice', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('listbox', { name: 'Narrow' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'Broad' })).getByRole('option', {
      name: 'Beta',
    }),
  );
  expect(success(registry.read('choice')).value).toBe('42');
  expect(screen.getByRole('alert')).toBeVisible();
  act(() => {
    expect(registry.update('choice', 'b').success).toBe(false);
  });
  view.rerender(
    <ReacdProvider>
      <BoundListbox node={node} registry={registry} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  expect(success(registry.read('choice')).value).toBe('b');
  expect(screen.queryByRole('alert')).toBeNull();
});

it('writes complete multiple selections and protects read bindings', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'choice', kind: 'selection', initial: ['42'], access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider>
      <BoundListbox node={{ ...node, mode: 'multiple' }} registry={registry} />
      <BoundListbox
        node={{
          ...node,
          mode: 'multiple',
          label: 'Reader',
          value: { state: 'choice', mode: 'read' },
        }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'Broad' })).getByRole('option', {
      name: 'Beta',
    }),
  );
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
  const reader = screen.getByRole('listbox', { name: 'Reader' });
  expect(reader).toHaveAttribute('aria-readonly', 'true');
  await user.click(within(reader).getByRole('option', { name: 'Answer' }));
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
  act(() => {
    expect(registry.update('choice', ['missing']).success).toBe(false);
  });
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
});

it.each([undefined, 'multiple' as const])(
  'reports direct missing bindings in mode %s before capabilities render',
  (mode) => {
    const registry = success(createStateRegistry([]));
    render(
      <ReacdProvider>
        <BoundListbox node={{ ...node, mode }} registry={registry} />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent(/choice/);
  },
);
