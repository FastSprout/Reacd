import { createElement } from 'react';
import { expect, it } from 'vitest';
import { chatPromptSchema } from './chat-prompt.schema.js';
import { CHAT_COMPOSER_POLICY } from '../../core/chat-composer-policy.js';
import { CHAT_POLICY } from '../../core/chat-policy.js';

const prompt = { label: 'Message', value: '', onValueChange() {}, onSubmit() {} };
const attachment = { id: 'reference', name: 'reference.txt', mediaType: 'text/plain' };

it('accepts controlled draft capabilities and validated attachment metadata', () => {
  for (const status of ['ready', 'submitted', 'streaming', 'error'])
    expect(chatPromptSchema.safeParse({ ...prompt, status }).success).toBe(true);
  expect(
    chatPromptSchema.safeParse({
      ...prompt,
      attachments: [attachment],
      onRemoveAttachment() {},
      onStop() {},
      onRetry() {},
      onClose() {},
      submitOnEnter: false,
      placeholder: 'Write a message',
      description: 'Example composer',
      disabled: true,
      readOnly: true,
      footer: null,
    }).success,
  ).toBe(true);
});

it('rejects unknown native props, unsafe files and unbounded draft content', () => {
  for (const change of [
    { value: 'x'.repeat(CHAT_COMPOSER_POLICY.maxDraftLength + 1) },
    { onSubmit: 'send' },
    { onValueChange: null },
    { status: 'sending' },
    { attachments: [attachment, attachment] },
    { attachments: Array.from({ length: CHAT_POLICY.maxAttachments + 1 }) },
    { attachments: [{ ...attachment, url: 'javascript:alert(1)' }] },
    { footer: createElement('div') },
    { rows: 99 },
    { style: {} },
    { className: 'x' },
    { onKeyDown() {} },
  ])
    expect(chatPromptSchema.safeParse({ ...prompt, ...change }).success).toBe(false);
});
