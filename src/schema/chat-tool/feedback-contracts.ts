import { z } from 'zod';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import type { chatReasoningNodeSchema } from '../chat-reasoning/index.js';
import type { chatShimmerNodeSchema } from '../chat-shimmer/index.js';
import { chatReasoningSchema } from '../chat-reasoning/index.js';
import { chatShimmerSchema } from '../chat-shimmer/index.js';
import type { chatToolNodeSchema } from './generative.schema.js';

export type ChatFeedbackNode =
  | z.infer<typeof chatReasoningNodeSchema>
  | z.infer<typeof chatShimmerNodeSchema>
  | z.infer<typeof chatToolNodeSchema>;

export function chatFeedbackBindings(node: ChatFeedbackNode): BindingContract[] {
  const contracts: BindingContract[] = [];
  if (node.type !== 'ChatShimmer')
    contracts.push({
      reference: node.open,
      property: 'open',
      kinds: ['boolean'],
      mode: node.open.mode,
      schema: z.boolean(),
    });
  if (node.type !== 'ChatTool' && typeof node.text === 'object')
    contracts.push({
      reference: node.text,
      property: 'text',
      kinds: ['text'],
      mode: 'read',
      schema:
        node.type === 'ChatShimmer'
          ? chatShimmerSchema.shape.text
          : chatReasoningSchema.shape.text,
    });
  if (node.type === 'ChatShimmer' && typeof node.active === 'object')
    contracts.push({
      reference: node.active,
      property: 'active',
      kinds: ['boolean'],
      mode: 'read',
      schema: z.boolean(),
    });
  return contracts;
}

export function chatFeedbackActionReferences(node: ChatFeedbackNode) {
  if (node.type !== 'ChatTool') return [];
  return (['approveAction', 'rejectAction', 'retryAction'] as const).flatMap(
    (property) => {
      const action = node[property];
      return action === undefined ? [] : [{ action, property }];
    },
  );
}
