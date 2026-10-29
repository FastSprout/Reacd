import { expect, it } from 'vitest';
import {
  chatComposerActionReferences,
  chatComposerBindings,
} from './composer-contracts.js';

it('collects every explicit capability and narrows draft/status contracts', () => {
  const prompt = {
    type: 'ChatPrompt',
    label: 'Draft',
    submitAction: 'send',
    value: { state: 'draft', mode: 'readWrite' },
    closeAction: 'close',
    status: { state: 'status', mode: 'read' },
    attachments: [
      { id: 'first', name: 'Report', mediaType: 'text/plain', removeAction: 'remove' },
      { id: 'fixed', name: 'Fixed report', mediaType: 'text/plain' },
    ],
  } as const;
  const node = { ...prompt, attachments: [...prompt.attachments] };
  expect(chatComposerActionReferences(node)).toEqual([
    { property: 'submitAction', action: 'send' },
    { property: 'closeAction', action: 'close' },
    { property: 'attachments[0].removeAction', action: 'remove' },
  ]);
  const contracts = chatComposerBindings(node);
  expect(contracts.map(({ property, mode }) => ({ property, mode }))).toEqual([
    { property: 'value', mode: 'readWrite' },
    { property: 'status', mode: 'read' },
  ]);
  expect(chatComposerBindings({ type: 'ChatPromptSubmit' })).toEqual([]);
  expect(chatComposerActionReferences({ type: 'ChatPromptSubmit' })).toEqual([]);
  expect(chatComposerBindings({ ...node, status: 'ready' })).toHaveLength(1);
});
