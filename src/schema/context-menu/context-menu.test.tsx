import { expect, it, vi } from 'vitest';
import { contextMenuSchema } from './context-menu.schema.js';
import { Text } from '../../components/text/text.js';
it('accepts safe context content and rejects native or unknown props', () => {
  const base = {
    label: 'Resource context',
    open: false,
    onOpenChange: vi.fn(),
    items: [],
  };
  expect(
    contextMenuSchema.safeParse({ ...base, children: <Text>Resource</Text> }).success,
  ).toBe(true);
  expect(
    contextMenuSchema.safeParse({ ...base, children: <div>Resource</div> }).success,
  ).toBe(false);
  expect(contextMenuSchema.safeParse({ ...base, onContextMenu: vi.fn() }).success).toBe(
    false,
  );
});
