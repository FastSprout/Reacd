import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { listboxSchema } from '../../src/schema/listbox/listbox.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { ListboxExample } from './listbox.js';

it('reports native unavailability and retains host region selection', () => {
  expectUnsupportedExample(<ListboxExample />, 'Listbox');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <ListboxExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Listbox', listboxSchema, 'Delivery region');
    if (value.mode === 'multiple') throw new Error('Expected single selection');
    return value;
  };
  expect(read().items.map((item) => item.value)).toEqual(['north', 'west', 'south']);
  expect(read().value).toBe('north');
  act(() => { read().onValueChange('south'); });
  expect(read().value).toBe('south');
});
