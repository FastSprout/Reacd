import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { dashboardDisplayLayout } from './dashboard-layout.js';

const regions = [
  { id: 'navigation', kind: 'sidebar' as const },
  { id: 'inbox', kind: 'panel' as const },
];

describe('dashboard collapsed presentation', () => {
  it('preserves saved shares and all percentage totals for closed modes', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10, max: 90 }), (share) => {
        const value = [
          { id: 'navigation', share },
          { id: 'inbox', share: 100 - share },
        ];
        for (const mode of ['offcanvas', 'icon'] as const) {
          const result = dashboardDisplayLayout(regions, value, false, false, mode);
          expect(result.reduce((sum, panel) => sum + panel.share, 0)).toBe(100);
          expect(value[0]?.share).toBe(share);
          expect(dashboardDisplayLayout(regions, value, true, false, mode)).toBe(value);
        }
        expect(
          dashboardDisplayLayout(regions, value, true, true, 'icon')[0]?.share,
        ).toBe(0);
      }),
    );
  });

  it('handles an end sidebar and rejects incomplete region pairs safely', () => {
    const reversed = [...regions].reverse();
    const value = [
      { id: 'inbox', share: 75 },
      { id: 'navigation', share: 25 },
    ];
    expect(dashboardDisplayLayout(reversed, value, false, false, 'offcanvas')).toEqual([
      { id: 'inbox', share: 100 },
      { id: 'navigation', share: 0 },
    ]);
    expect(dashboardDisplayLayout([], value, false, false, 'icon')).toBe(value);
    const single = [{ id: 'navigation', share: 100 }];
    expect(dashboardDisplayLayout(regions, single, false, false, 'icon')).toBe(single);
    const third = [...regions, { id: 'notes', kind: 'panel' as const }];
    const many = [...value].reverse();
    many.push({ id: 'notes', share: 10 });
    expect(dashboardDisplayLayout(third, many, false, false, 'offcanvas')[2]).toEqual({
      id: 'notes',
      share: 10,
    });
  });
});
