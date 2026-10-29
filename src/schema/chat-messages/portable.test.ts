import { expect, it } from 'vitest';
import { chatAttachmentNodeSchema } from '../chat-attachment/generative.schema.js';
import {
  chatMessageLiteralSchema,
  chatMessageNodeSchema,
} from '../chat-message/generative.schema.js';
import { chatMessagesNodeSchema } from './generative.schema.js';
import { chatNodeActionReferences } from './action-references.js';

const message = { id: 'answer', author: 'Assistant', role: 'assistant', content: '' };
const action = { id: 'retry', label: 'Regenerate', action: 'regenerate' };

it('keeps literal transport closed and reports every nested action reference', () => {
  const attachment = chatAttachmentNodeSchema.parse({
    type: 'ChatAttachment',
    name: 'report.pdf',
    mediaType: 'application/pdf',
  });
  expect(chatNodeActionReferences(attachment)).toEqual([]);
  expect(chatNodeActionReferences({ ...attachment, removeAction: 'remove' })).toEqual([
    { action: 'remove', property: 'removeAction' },
  ]);
  const single = chatMessageNodeSchema.parse({ type: 'ChatMessage', ...message });
  expect(chatNodeActionReferences(single)).toEqual([]);
  expect(chatNodeActionReferences({ ...single, actions: [action] })).toEqual([
    { action: 'regenerate', property: 'actions[0].action' },
  ]);
  const list = chatMessagesNodeSchema.parse({
    type: 'ChatMessages',
    label: 'Conversation',
    messages: [message, { ...message, id: 'second', actions: [action] }],
    retryAction: 'retry',
  });
  expect(chatNodeActionReferences(list)).toEqual([
    { action: 'retry', property: 'retryAction' },
    { action: 'regenerate', property: 'messages[1].actions[0].action' },
  ]);
  expect(
    chatNodeActionReferences({ ...list, retryAction: undefined, messages: [] }),
  ).toEqual([]);
  expect(
    chatMessageLiteralSchema.safeParse({ ...message, actions: [action, action] })
      .success,
  ).toBe(false);
  expect(
    chatMessagesNodeSchema.safeParse({ ...list, messages: [message, message] }).success,
  ).toBe(false);
  expect(
    chatAttachmentNodeSchema.safeParse({ ...attachment, onRemove() {} }).success,
  ).toBe(false);
  expect(
    chatMessageNodeSchema.safeParse({ ...single, actions: [{ ...action, html: '' }] })
      .success,
  ).toBe(false);
});
