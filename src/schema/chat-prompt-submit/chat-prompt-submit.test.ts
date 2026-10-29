import { expect, it } from 'vitest';
import { chatPromptSubmitSchema } from './chat-prompt-submit.schema.js';

it('allows inherited scope or explicit standalone capabilities', () => {
  expect(chatPromptSubmitSchema.safeParse({}).success).toBe(true);
  for (const status of ['ready', 'submitted', 'streaming', 'error'])
    expect(
      chatPromptSubmitSchema.safeParse({
        status,
        disabled: true,
        onSubmit() {},
        onStop() {},
        onRetry() {},
        label: 'Request action',
      }).success,
    ).toBe(true);
});

it('rejects native events, styling and invalid action capabilities', () => {
  for (const properties of [
    { status: 'sending' },
    { onSubmit: 'send' },
    { label: '' },
    { className: 'x' },
    { style: {} },
    { onClick() {} },
  ])
    expect(chatPromptSubmitSchema.safeParse(properties).success).toBe(false);
});
