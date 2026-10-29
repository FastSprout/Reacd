import { expect, it } from 'vitest';
import { chatToolSchema } from './chat-tool.schema.js';
import { CHAT_FEEDBACK_POLICY } from '../../core/chat-feedback-policy.js';

const tool = {
  label: 'Read reference',
  status: 'pending',
  open: false,
  onOpenChange: () => undefined,
};

it('accepts all statuses, readonly approval and paired host decisions', () => {
  for (const status of ['pending', 'running', 'approval', 'success', 'error'])
    expect(chatToolSchema.safeParse({ ...tool, status }).success).toBe(true);
  expect(
    chatToolSchema.safeParse({
      ...tool,
      status: 'approval',
      onApprove() {},
      onReject() {},
      input: 'Input',
      output: 'Output',
      error: 'Error',
      disabled: true,
    }).success,
  ).toBe(true);
  expect(
    chatToolSchema.safeParse({ ...tool, status: 'error', onRetry() {} }).success,
  ).toBe(true);
});

it('rejects partial/stale decisions and arbitrary output rendering', () => {
  for (const change of [
    { status: 'unknown' },
    { label: '' },
    { output: 'x'.repeat(CHAT_FEEDBACK_POLICY.maxToolOutputLength + 1) },
    { onApprove() {} },
    { onReject() {} },
    { onRetry() {} },
    { status: 'approval', onApprove() {} },
    { status: 'approval', onReject() {} },
    { status: 'error', onApprove() {}, onReject() {} },
    { onOpenChange: null },
    { children: '<script/>' },
    { render() {} },
    { className: 'x' },
  ])
    expect(chatToolSchema.safeParse({ ...tool, ...change }).success).toBe(false);
});
