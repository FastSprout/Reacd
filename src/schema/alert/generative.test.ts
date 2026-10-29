import { expect, it } from 'vitest';
import { alertNodeSchema } from './generative.schema.js';
import { alertNodeActionReferences } from './action-references.js';
const node = {
  type: 'Alert',
  title: 'Review',
  message: 'Read the guide.',
  intent: 'info',
};
it('validates visibility and every registered action reference', () => {
  const literal = alertNodeSchema.parse(node);
  expect(alertNodeActionReferences(literal)).toEqual([]);
  expect(alertNodeSchema.safeParse({ ...node, open: false }).success).toBe(true);
  const actionable = alertNodeSchema.parse({
    ...node,
    open: { state: 'visible', mode: 'readWrite' },
    closeLabel: 'Dismiss message',
    actions: [{ id: 'review', label: 'Review', action: 'review' }],
  });
  expect(alertNodeActionReferences(actionable)).toEqual([
    { action: 'review', property: 'actions[0].action' },
  ]);
  for (const change of [
    { closeLabel: 'Dismiss' },
    { open: { state: 'visible', mode: 'read' }, closeLabel: 'Dismiss' },
    {
      actions: [
        { id: 'a', label: 'A', action: 'review' },
        { id: 'a', label: 'B', action: 'review' },
      ],
    },
    { actions: [{ id: 'a', label: 'A', onPress: () => undefined }] },
  ])
    expect(alertNodeSchema.safeParse({ ...node, ...change }).success).toBe(false);
});
