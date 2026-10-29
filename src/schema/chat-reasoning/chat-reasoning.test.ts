import { expect, it } from 'vitest';
import { chatReasoningSchema } from './chat-reasoning.schema.js';
import { CHAT_FEEDBACK_POLICY } from '../../core/chat-feedback-policy.js';

it('accepts empty and streaming summaries with explicit controlled state', () => {
  for (const text of ['', 'Example summary'])
    expect(
      chatReasoningSchema.safeParse({
        text,
        open: false,
        onOpenChange: () => undefined,
        streaming: true,
        autoOpen: true,
        autoClose: true,
        disabled: true,
      }).success,
    ).toBe(true);
});

it('rejects unbounded summaries, missing callbacks and rendering escapes', () => {
  for (const change of [
    { text: null },
    { text: 'x'.repeat(CHAT_FEEDBACK_POLICY.maxSummaryLength + 1) },
    { onOpenChange: 'toggle' },
    { open: undefined },
    { autoOpen: 'yes' },
    { label: '' },
    { style: {} },
    { children: 'Custom content' },
  ])
    expect(
      chatReasoningSchema.safeParse({
        text: 'Summary',
        open: false,
        onOpenChange: () => undefined,
        ...change,
      }).success,
    ).toBe(false);
});
