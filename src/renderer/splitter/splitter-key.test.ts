import { describe, expect, it } from 'vitest';
import { splitterKey } from './splitter-key.js';

const options = {
  index: 0,
  shift: false,
  orientation: 'horizontal' as const,
  direction: 'ltr' as const,
  expanded: new Map<string, number>(),
  panels: [
    { id: 'first', minShare: 20, maxShare: 80, collapsedShare: 0 },
    { id: 'second', minShare: 20, maxShare: 100 },
  ],
  value: [
    { id: 'first', share: 0 },
    { id: 'second', share: 100 },
  ],
};

describe('Splitter key routing', () => {
  it('uses minimum as the initial restore target for collapsed server state', () => {
    expect(splitterKey({ ...options, key: 'Enter' })?.[0]?.share).toBe(20);
    expect(
      splitterKey({
        ...options,
        key: 'Enter',
        panels: [
          { id: 'first', minShare: 20, maxShare: 80 },
          { id: 'second', minShare: 20, maxShare: 100 },
        ],
      }),
    ).toBeNull();
  });

  it('ignores incomplete pairs and non-resize keys', () => {
    expect(splitterKey({ ...options, index: 2, key: 'ArrowRight' })).toBeNull();
    expect(splitterKey({ ...options, value: [], key: 'ArrowRight' })).toBeNull();
    expect(
      splitterKey({
        ...options,
        panels: [options.panels[0]].filter((panel) => panel !== undefined),
        key: 'ArrowRight',
      }),
    ).toBeNull();
    expect(splitterKey({ ...options, key: 'Tab' })).toBeNull();
  });
});
