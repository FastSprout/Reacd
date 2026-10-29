import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { editorOptionsSchema } from './editor.schema.js';
import { editorDocumentSchema } from './document/index.js';

export const editorNodeBaseSchema = editorOptionsSchema.extend({
  type: z.literal('Editor'),
  value: stateBindingSchema,
});
type EditorNodeData = z.infer<typeof editorNodeBaseSchema>;

export interface EditorNode<Child> extends EditorNodeData {
  readonly toolbar?: readonly Child[] | undefined;
  readonly children?: readonly Child[] | undefined;
}

export function createEditorNodeSchema<Child extends z.ZodType>(child: Child) {
  const slot = z.array(child).max(DOCUMENT_POLICY.maxChildren).readonly().optional();
  return editorNodeBaseSchema.extend({ toolbar: slot, children: slot }).readonly();
}

export function editorNodeBindings(node: EditorNode<unknown>): BindingContract[] {
  return [
    {
      reference: node.value,
      property: 'value',
      kinds: ['richDocument'],
      mode: node.value.mode,
      schema: editorDocumentSchema,
    },
  ];
}
