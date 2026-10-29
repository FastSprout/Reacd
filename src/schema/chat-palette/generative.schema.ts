import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';

export interface ChatPaletteNode<Child> {
  type: 'ChatPalette';
  label: string;
  children: Child[];
  prompt?: Child[] | undefined;
}
export function chatPaletteNodeSchema<Child extends z.ZodType>(child: Child) {
  const nodes = z.array(child).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    type: z.literal('ChatPalette'),
    label: labelSchema,
    children: nodes,
    prompt: nodes.optional(),
  });
}
