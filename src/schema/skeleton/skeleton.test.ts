import { describe, expect, it } from 'vitest';
import { skeletonSchema } from './skeleton.schema.js';

describe('Skeleton contract', () => {
  it('accepts bounded semantic shapes and optional loading status', () => {
    for (const props of [
      {},
      { shape: 'text', lines: 8, size: 'large', label: 'Loading orders' },
      { shape: 'avatar', size: 'small', animated: false },
      { shape: 'rectangle', show: false },
    ])
      expect(skeletonSchema.safeParse(props).success).toBe(true);
  });
  it('rejects invalid line combinations and styling escapes', () => {
    for (const props of [
      { lines: 0 },
      { lines: 9 },
      { lines: 1.5 },
      { shape: 'avatar', lines: 1 },
      { shape: 'rectangle', lines: 2 },
      { shape: 'custom' },
      { size: 'huge' },
      { label: ' ' },
      { children: 'Markup' },
      { width: 200 },
      { height: 40 },
      { className: 'custom' },
      { style: {} },
      { onClick: () => undefined },
    ])
      expect(skeletonSchema.safeParse(props).success).toBe(false);
  });
});
