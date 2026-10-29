import { booleanValueSchema } from '../state/boolean/boolean.schema.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import type { FormNode } from './generative.schema.js';

export function formNodeBindings(node: FormNode<unknown>): BindingContract[] {
  return (['disabled', 'submitting'] as const).flatMap((property) => {
    const reference = node[property];
    return typeof reference === 'object'
      ? [
          {
            reference,
            property,
            kinds: ['boolean'],
            mode: 'read',
            schema: booleanValueSchema,
          },
        ]
      : [];
  });
}
