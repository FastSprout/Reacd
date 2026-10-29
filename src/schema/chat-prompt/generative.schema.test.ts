import { z } from 'zod';
import { expect, it } from 'vitest';
import { chatPromptNodeSchema } from './generative.schema.js';
import { chatPaletteNodeSchema } from '../chat-palette/generative.schema.js';
import { chatPromptSubmitNodeSchema } from '../chat-prompt-submit/generative.schema.js';

it('validates explicit draft references, actions and bounded recursive slots', () => {
  const schema = chatPromptNodeSchema(z.literal('child'));
  const node = {
    type: 'ChatPrompt',
    label: 'Draft',
    value: { state: 'draft', mode: 'readWrite' },
    submitAction: 'send',
    status: { state: 'status', mode: 'read' },
    footer: ['child'],
    attachments: [
      { id: 'report', name: 'Report', mediaType: 'text/plain', removeAction: 'remove' },
    ],
  };
  expect(schema.safeParse(node).success).toBe(true);
  expect(schema.safeParse({ ...node, onSubmit: 'code' }).success).toBe(false);
  expect(schema.safeParse({ ...node, footer: ['html'] }).success).toBe(false);
  expect(
    schema.safeParse({
      ...node,
      attachments: [node.attachments[0], node.attachments[0]],
    }).success,
  ).toBe(false);
  expect(
    schema.safeParse({ ...node, status: { state: 'status', mode: 'readWrite' } })
      .success,
  ).toBe(false);
});

it('keeps palette slots recursive and standalone actions registered by name', () => {
  expect(
    chatPaletteNodeSchema(z.literal('child')).safeParse({
      type: 'ChatPalette',
      label: 'Conversation',
      children: ['child'],
      prompt: ['child'],
    }).success,
  ).toBe(true);
  expect(
    chatPromptSubmitNodeSchema.safeParse({
      type: 'ChatPromptSubmit',
      submitAction: 'send',
      stopAction: 'stop',
      retryAction: 'retry',
    }).success,
  ).toBe(true);
  expect(
    chatPromptSubmitNodeSchema.safeParse({ type: 'ChatPromptSubmit', onClick: 'send' })
      .success,
  ).toBe(false);
});
