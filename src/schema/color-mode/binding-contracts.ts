import type { ColorModeNode } from './generative.types.js';
import { colorModeValueSchema, resolvedColorModeSchema } from './color-mode.schema.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';

export function colorModeBindings(node: ColorModeNode): BindingContract[] {
  if (node.type === 'ColorModeAvatar' || node.type === 'ColorModeImage')
    return typeof node.mode === 'object'
      ? [
          {
            reference: node.mode,
            property: 'mode',
            mode: 'read',
            kinds: ['text'],
            schema: resolvedColorModeSchema,
          },
        ]
      : [];
  const bindings: BindingContract[] = [
    {
      reference: node.value,
      property: 'value',
      kinds: ['text'],
      mode: node.value.mode,
      schema: colorModeValueSchema,
    },
  ];
  if (typeof node.systemMode === 'object')
    bindings.push({
      reference: node.systemMode,
      property: 'systemMode',
      mode: 'read',
      kinds: ['text'],
      schema: resolvedColorModeSchema,
    });
  return bindings;
}
