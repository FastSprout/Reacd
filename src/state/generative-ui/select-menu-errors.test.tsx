import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BoundSelectMenu } from './bound-select-menu.js';
import { BoundSelectMenuChannels } from './bound-select-menu-channels.js';
import { createStateRegistry } from '../registry/state-registry.js';
import type { SelectMenuProps } from '../../components/select-menu/index.js';

const node = {
  type: 'SelectMenu',
  label: 'Binding errors',
  items: [],
  value: { state: 'missing', mode: 'readWrite' },
} as const;
const properties: SelectMenuProps = {
  label: node.label,
  items: [],
  value: '',
  onValueChange: () => undefined,
};

it('reports missing single and multiple selection bindings', () => {
  const registry = createStateRegistry([]);
  if (!registry.success) throw new Error('Missing registry.');
  const view = render(<BoundSelectMenu node={node} registry={registry.data} />);
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  view.rerender(
    <BoundSelectMenu node={{ ...node, mode: 'multiple' }} registry={registry.data} />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
});

it('reports optional channel binding failures', () => {
  const registry = createStateRegistry([]);
  if (!registry.success) throw new Error('Missing registry.');
  const view = render(
    <BoundSelectMenuChannels
      properties={properties}
      node={{ ...node, query: { state: 'missing', mode: 'read' } }}
      registry={registry.data}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  view.rerender(
    <BoundSelectMenuChannels
      properties={properties}
      node={{ ...node, open: { state: 'missing', mode: 'readWrite' } }}
      registry={registry.data}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
});
