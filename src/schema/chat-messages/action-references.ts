import type { z } from 'zod';
import type { chatAttachmentNodeSchema } from '../chat-attachment/generative.schema.js';
import type { chatMessageNodeSchema } from '../chat-message/generative.schema.js';
import type { chatMessagesNodeSchema } from './generative.schema.js';

export type ChatNode =
  | z.infer<typeof chatAttachmentNodeSchema>
  | z.infer<typeof chatMessageNodeSchema>
  | z.infer<typeof chatMessagesNodeSchema>;

export function chatNodeActionReferences(node: ChatNode) {
  if (node.type === 'ChatAttachment')
    return node.removeAction === undefined
      ? []
      : [{ action: node.removeAction, property: 'removeAction' }];
  if (node.type === 'ChatMessage')
    return (node.actions ?? []).map((action, index) => ({
      action: action.action,
      property: `actions[${index}].action`,
    }));
  return [
    ...(node.retryAction === undefined
      ? []
      : [{ action: node.retryAction, property: 'retryAction' }]),
    ...node.messages.flatMap((message, messageIndex) =>
      (message.actions ?? []).map((action, index) => ({
        action: action.action,
        property: `messages[${messageIndex}].actions[${index}].action`,
      })),
    ),
  ];
}
