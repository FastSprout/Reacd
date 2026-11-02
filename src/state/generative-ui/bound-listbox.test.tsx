import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundListbox } from './bound-listbox.js';
import { listboxSchema } from '../../schema/listbox/index.js';
import { exampleDeclarationProbe } from
  '../../../test-support/example-declaration-probe.js';

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

it('constrains shared writes, vetoes refused requests and recovers', () => {
  const probe = exampleDeclarationProbe();
  const registry = success(
    createStateRegistry([
      { key: 'choice', kind: 'text', initial: '42', access: 'readWrite' },
    ]),
  );
  const view = render(
    <probe.Surface>
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
    </probe.Surface>,
  );
  expect(probe.read('Listbox', listboxSchema.options[0], 'Narrow').readOnly)
    .toBe(true);
  act(() => {
    expect(probe.read('Listbox', listboxSchema.options[0], 'Broad')
      .onValueChange('b')).toBe(false);
  });
  expect(success(registry.read('choice')).value).toBe('42');
  act(() => {
    expect(registry.update('choice', 'b').success).toBe(false);
  });
  view.rerender(
    <probe.Surface>
      <BoundListbox node={node} registry={registry} />
    </probe.Surface>,
  );
  act(() => {
    expect(probe.read('Listbox', listboxSchema.options[0], 'Broad')
      .onValueChange('b')).toBe(true);
  });
  expect(success(registry.read('choice')).value).toBe('b');
  expect(probe.read('Listbox', listboxSchema.options[0], 'Broad').value).toBe('b');
  expect(screen.queryByRole('alert')).toBeNull();
});

it('writes complete multiple selections and protects read bindings', () => {
  const probe = exampleDeclarationProbe();
  const registry = success(
    createStateRegistry([
      { key: 'choice', kind: 'selection', initial: ['42'], access: 'readWrite' },
    ]),
  );
  render(
    <probe.Surface>
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
    </probe.Surface>,
  );
  act(() => {
    expect(probe.read('Listbox', listboxSchema.options[1], 'Broad')
      .onValueChange(['42', 'b'])).toBe(true);
  });
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
  const reader = probe.read('Listbox', listboxSchema.options[1], 'Reader');
  expect(reader.readOnly).toBe(true);
  act(() => { expect(reader.onValueChange([])).toBe(false); });
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
  act(() => {
    expect(registry.update('choice', ['missing']).success).toBe(false);
  });
  expect(success(registry.read('choice')).value).toEqual(['42', 'b']);
});

it.each([undefined, 'multiple' as const])(
  'reports direct missing bindings in mode %s before capabilities render',
  (mode) => {
    const probe = exampleDeclarationProbe();
    const registry = success(createStateRegistry([]));
    render(
      <probe.Surface>
        <BoundListbox node={{ ...node, mode }} registry={registry} />
      </probe.Surface>,
    );
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent(/choice/);
  },
);
