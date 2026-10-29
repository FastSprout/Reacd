import { z } from 'zod';
import { CHAT_STATUSES } from '../../core/chat-policy.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import type { ChatPromptNode } from './generative.schema.js';
import { promptDraftSchema } from './chat-prompt.schema.js';
import type { chatPromptSubmitNodeSchema } from '../chat-prompt-submit/index.js';

export type ChatComposerLeaf = z.infer<typeof chatPromptSubmitNodeSchema>;
export const promptStatusSchema = z.enum(CHAT_STATUSES);

export function chatComposerBindings<Child>(
  node: ChatPromptNode<Child> | ChatComposerLeaf,
): BindingContract[] {
  if (node.type !== 'ChatPrompt') return [];
  const bindings: BindingContract[] = [
    {
      reference: node.value,
      property: 'value',
      kinds: ['text'],
      mode: node.value.mode,
      schema: promptDraftSchema,
    },
  ];
  if (typeof node.status === 'object')
    bindings.push({
      reference: node.status,
      property: 'status',
      kinds: ['text'],
      mode: 'read',
      schema: promptStatusSchema,
    });
  return bindings;
}

export function chatComposerActionReferences<Child>(
  node: ChatPromptNode<Child> | ChatComposerLeaf,
) {
  const references: { action: string; property: string }[] = (
    ['submitAction', 'stopAction', 'retryAction'] as const
  ).flatMap((property) => {
    const action = node[property];
    return action === undefined ? [] : [{ action, property }];
  });
  if (node.type === 'ChatPrompt') {
    if (node.closeAction !== undefined)
      references.push({ action: node.closeAction, property: 'closeAction' });
    node.attachments?.forEach((file, index) => {
      if (file.removeAction !== undefined)
        references.push({
          action: file.removeAction,
          property: `attachments[${index}].removeAction`,
        });
    });
  }
  return references;
}
