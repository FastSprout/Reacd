import { describe, expect, it, vi } from 'vitest';
import { slideoverSchema } from './slideover.schema.js';
import { Text } from '../../components/text/text.js';
const properties = {
  title: 'Edit resource',
  description: 'Current resource.',
  open: false,
  onOpenChange: vi.fn(),
};
describe('closed slideover schema', () => {
  it('accepts safe slots and logical edges', () => {
    for (const placement of ['top', 'bottom', 'start', 'end']) {
      expect(
        slideoverSchema.safeParse({
          ...properties,
          placement,
          children: <Text>Body</Text>,
          footer: <Text>Footer</Text>,
        }).success,
      ).toBe(true);
    }
  });
  it('rejects low-level layout and unsafe content', () => {
    for (const overrides of [
      { placement: 'left' },
      { className: 'custom' },
      { style: {} },
      { children: <div>Native content</div> },
      { footer: <button>Native</button> },
      { onOpenChange: false },
      { snapPoints: [120, 240] },
    ])
      expect(slideoverSchema.safeParse({ ...properties, ...overrides }).success).toBe(
        false,
      );
  });
});
