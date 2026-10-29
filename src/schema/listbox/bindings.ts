import type { BindingContract } from '../generative-v2/binding-contract.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../selection/index.js';
import type { ListboxNode } from './generative.schema.js';

export function listboxBindings(node: ListboxNode): BindingContract[] {
  return [
    {
      reference: node.value,
      property: 'value',
      kinds: node.mode === 'multiple' ? ['selection'] : ['text'],
      mode: node.value.mode,
      schema:
        node.mode === 'multiple'
          ? multipleSelectionValueSchema(node.items)
          : singleSelectionValueSchema(node.items),
    },
  ];
}
