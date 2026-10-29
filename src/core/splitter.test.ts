import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { collapsePair, pairBounds, resizePair } from './splitter.js';

const panels = [
  { id: 'first', minShare: 20, maxShare: 80 },
  { id: 'second', minShare: 20, maxShare: 80 },
];
const value = [
  { id: 'first', share: 50 },
  { id: 'second', share: 50 },
];

describe('splitter adjacent pair arithmetic', () => {
  it('preserves totals and all unaffected identities for finite deltas', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: 1000 }), (delta) => {
        const result = resizePair(panels, value, 0, 50 + delta);
        expect(result.reduce((total, item) => total + item.share, 0)).toBe(100);
        expect(result[0]?.share).toBeGreaterThanOrEqual(20);
        expect(result[0]?.share).toBeLessThanOrEqual(80);
        expect(result.map((item) => item.id)).toEqual(['first', 'second']);
      }),
    );
  });

  it('rejects missing pairs and non-finite requests without mutation', () => {
    expect(resizePair(panels, value, 1, 40)).toBe(value);
    expect(resizePair(panels, value, 0, Number.NaN)).toBe(value);
    expect(pairBounds(panels, value, 3)).toBeNull();
    expect(value[0]?.share).toBe(50);
  });

  it('uses collapsed endpoints and preserves unrelated panels', () => {
    const three = [...panels, { id: 'last', minShare: 10, maxShare: 80 }];
    const shares = [...value, { id: 'last', share: 10 }];
    expect(resizePair(three, shares, 0, 60)[2]).toBe(shares[2]);
    const collapsible = [
      { id: 'first', minShare: 20, maxShare: 80, collapsedShare: 0 },
      { id: 'second', minShare: 20, maxShare: 80 },
    ];
    expect(pairBounds(collapsible, value, 0)).toEqual({ min: 20, max: 80 });
  });

  it('collapses valid pairs and rejects collapse without adjacent capacity', () => {
    const constraints = [
      { id: 'first', minShare: 20, maxShare: 80, collapsedShare: 0 },
      { id: 'second', minShare: 20, maxShare: 100 },
      { id: 'last', minShare: 10, maxShare: 80 },
    ];
    const shares = [...value, { id: 'last', share: 10 }];
    const result = collapsePair(constraints, shares, 0);
    expect(result[0]?.share).toBe(0);
    expect(result[1]?.share).toBe(100);
    expect(result[2]).toBe(shares[2]);
    expect(collapsePair(panels, value, 0)).toBe(value);
    expect(collapsePair(constraints, value, 2)).toBe(value);
    expect(collapsePair(constraints, [], 0)).toEqual([]);
    expect(
      collapsePair(
        [
          {
            ...constraints[0],
            id: 'first',
            minShare: 20,
            maxShare: 80,
            collapsedShare: 0,
          },
          { id: 'second', minShare: 20, maxShare: 80 },
        ],
        value,
        0,
      ),
    ).toBe(value);
    const tooSmall = [
      { id: 'first', minShare: 20, maxShare: 80, collapsedShare: 10 },
      { id: 'second', minShare: 95, maxShare: 100 },
    ];
    expect(collapsePair(tooSmall, value, 0)).toBe(value);
  });

  it('respects fractional constraints and rejects impossible expansion', () => {
    const fractional = [
      { id: 'first', minShare: 20.1234, maxShare: 80 },
      { id: 'second', minShare: 20, maxShare: 80 },
    ];
    expect(resizePair(fractional, value, 0, 0)[0]?.share).toBe(20.1234);
    const impossible = [
      { id: 'first', minShare: 80, maxShare: 90 },
      { id: 'second', minShare: 80, maxShare: 90 },
    ];
    expect(resizePair(impossible, value, 0, 50)).toBe(value);
  });
});
