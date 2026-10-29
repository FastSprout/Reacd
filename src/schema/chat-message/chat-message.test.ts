import { expect, it } from 'vitest';
import { chatMessageSchema } from './chat-message.schema.js';
import { CHAT_POLICY } from '../../core/chat-policy.js';

const message = { id: 'answer', author: 'Assistant', role: 'assistant', content: '' };

it('accepts all roles, statuses, attachments and explicit host actions', () => {
  for (const role of ['user', 'assistant', 'system', 'tool']) {
    for (const status of ['ready', 'streaming', 'error']) {
      expect(
        chatMessageSchema.safeParse({
          ...message,
          role,
          status,
          error: 'Response interrupted.',
          attachments: [{ name: 'photo.png', mediaType: 'image/png' }],
          actions: [{ id: 'retry', label: 'Retry answer', onPress: () => undefined }],
        }).success,
      ).toBe(true);
    }
  }
});

it('rejects duplicate actions, oversized collections and arbitrary rendering', () => {
  const action = { id: 'retry', label: 'Retry', onPress: () => undefined };
  for (const change of [
    { id: '' },
    { author: '' },
    { role: 'admin' },
    { content: null },
    { content: 'x'.repeat(CHAT_POLICY.maxMessageLength + 1) },
    { actions: [action, action] },
    { actions: Array.from({ length: CHAT_POLICY.maxActions + 1 }, () => action) },
    { attachments: Array.from({ length: CHAT_POLICY.maxAttachments + 1 }) },
    { attachments: [{ name: 'File', mediaType: 'text/plain', onRemove: () => {} }] },
    { actions: [{ id: 'a', label: 'Action', onPress: 'go' }] },
    { className: 'custom' },
    { children: 'arbitrary content' },
    { dangerouslySetInnerHTML: { __html: '<script/>' } },
  ])
    expect(chatMessageSchema.safeParse({ ...message, ...change }).success).toBe(false);
});
