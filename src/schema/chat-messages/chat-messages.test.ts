import { expect, it } from 'vitest';
import { chatMessagesSchema } from './chat-messages.schema.js';
import { CHAT_POLICY } from '../../core/chat-policy.js';

const message = { id: 'answer', author: 'Assistant', role: 'assistant', content: '' };

it('accepts empty, waiting, streaming, ready and failed transcripts', () => {
  expect(
    chatMessagesSchema.safeParse({ label: 'Conversation', messages: [] }).success,
  ).toBe(true);
  for (const status of ['ready', 'submitted', 'streaming', 'error'])
    expect(
      chatMessagesSchema.safeParse({
        label: 'Conversation',
        messages: [message],
        status,
        error: 'Network unavailable.',
        onRetry: () => undefined,
        followLatest: false,
      }).success,
    ).toBe(true);
});

it('rejects duplicate message identities and unbounded transcripts', () => {
  for (const change of [
    { label: '' },
    { messages: [message, message] },
    { messages: Array.from({ length: CHAT_POLICY.maxMessages + 1 }, () => message) },
    { status: 'loading' },
    { followLatest: 'always' },
    { onRetry: 'retry' },
    { style: {} },
    { onScroll: () => undefined },
  ])
    expect(
      chatMessagesSchema.safeParse({ label: 'Conversation', messages: [], ...change })
        .success,
    ).toBe(false);
});
