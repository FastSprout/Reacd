import { expect, it } from 'vitest';
import { chatReasoningNodeSchema } from '../chat-reasoning/index.js';
import { chatShimmerNodeSchema } from '../chat-shimmer/index.js';
import { chatToolNodeSchema } from './generative.schema.js';
import {
  chatFeedbackBindings,
  chatFeedbackActionReferences,
} from './feedback-contracts.js';

it('declares read/write contracts without expressions or callback transport', () => {
  const reasoning = chatReasoningNodeSchema.parse({
    type: 'ChatReasoning',
    text: { state: 'summary', mode: 'read' },
    open: { state: 'expanded', mode: 'readWrite' },
  });
  expect(
    chatFeedbackBindings(reasoning).map(({ property, kinds, mode }) => ({
      property,
      kinds,
      mode,
    })),
  ).toEqual([
    { property: 'open', kinds: ['boolean'], mode: 'readWrite' },
    { property: 'text', kinds: ['text'], mode: 'read' },
  ]);
  expect(chatFeedbackActionReferences(reasoning)).toEqual([]);
  const shimmer = chatShimmerNodeSchema.parse({
    type: 'ChatShimmer',
    text: { state: 'status', mode: 'read' },
    active: { state: 'working', mode: 'read' },
  });
  expect(chatFeedbackBindings(shimmer).map(({ property }) => property)).toEqual([
    'text',
    'active',
  ]);
  expect(chatFeedbackBindings({ type: 'ChatShimmer', text: 'Working' })).toEqual([]);
  expect(
    chatReasoningNodeSchema.safeParse({
      ...reasoning,
      text: { state: 'summary', mode: 'readWrite' },
    }).success,
  ).toBe(false);
  expect(
    chatToolNodeSchema.safeParse({
      type: 'ChatTool',
      label: 'Read',
      status: 'pending',
      open: { state: 'expanded', mode: 'read' },
      onOpenChange() {},
    }).success,
  ).toBe(false);
});

it('validates paired tool intents and lists every registered action key', () => {
  const tool = chatToolNodeSchema.parse({
    type: 'ChatTool',
    label: 'Read reference',
    status: 'approval',
    open: { state: 'expanded', mode: 'read' },
    approveAction: 'approve',
    rejectAction: 'reject',
  });
  expect(chatFeedbackBindings(tool).map(({ property }) => property)).toEqual(['open']);
  expect(chatFeedbackActionReferences(tool)).toEqual([
    { action: 'approve', property: 'approveAction' },
    { action: 'reject', property: 'rejectAction' },
  ]);
  expect(
    chatFeedbackActionReferences({
      ...tool,
      status: 'error',
      approveAction: undefined,
      rejectAction: undefined,
      retryAction: 'retry',
    }),
  ).toEqual([{ action: 'retry', property: 'retryAction' }]);
  expect(
    chatToolNodeSchema.safeParse({ ...tool, rejectAction: undefined }).success,
  ).toBe(false);
});
