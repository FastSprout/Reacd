import { z } from 'zod';
import { formNodeBindings } from '../form/index.js';
import { fieldErrorSchema } from '../form-field/index.js';
import { textareaValueSchema } from '../textarea/textarea.schema.js';
import type { GenerativeNode } from './generative-node.js';
import type { BindingContract } from './binding-contract.js';

export function formBindings(node: Extract<GenerativeNode, {
  type: 'Form' | 'FormField' | 'Switch' | 'Textarea';
}>): BindingContract[] {
  switch (node.type) {
    case 'Form':
      return formNodeBindings(node);
    case 'FormField':
      return typeof node.error === 'object' ? [{
        reference: node.error, property: 'error', kinds: ['text'],
        mode: 'read', schema: fieldErrorSchema,
      }] : [];
    case 'Switch':
      return [{
        reference: node.checked, property: 'checked', kinds: ['boolean'],
        mode: node.checked.mode, schema: z.boolean(),
      }];
    case 'Textarea':
      return [{
        reference: node.value, property: 'value', kinds: ['text'],
        mode: node.value.mode, schema: textareaValueSchema(node.maxLength),
      }];
  }
}
