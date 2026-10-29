import { describe, expect, it } from 'vitest';
import { filterCommandGroups } from './command-search.js';
import { COMMAND_POLICY } from './command-policy.js';

const groups = [
  {
    key: 'docs',
    label: 'Docs',
    items: [
      { key: 'intro', label: 'Introduction', keywords: ['start here'] },
      { key: 'cafe', label: 'Café', description: 'European overview' },
      { key: 'guide', label: 'Guide' },
      { key: 'guide-extra', label: 'Guide advanced' },
    ],
  },
];
describe('deterministic command matching', () => {
  it('bounds visible results across groups', () => {
    const items = Array.from({ length: COMMAND_POLICY.maximumResults }, (_, index) => ({
      key: `item-${index}`,
      label: 'Matching item',
    }));
    expect(
      filterCommandGroups(
        [
          { key: 'empty', label: 'Empty', items: [] },
          { key: 'first', label: 'First', items },
          { key: 'second', label: 'Second', items },
        ],
        '',
        'local',
      ),
    ).toHaveLength(1);
  });
  it('normalizes diacritics and matches every token without ambient locale', () => {
    expect(filterCommandGroups(groups, 'cafe EUROPEAN', 'local')[0]?.items).toEqual([
      groups[0]?.items[1],
    ]);
    expect(filterCommandGroups(groups, 'start', 'local')[0]?.items).toEqual([
      groups[0]?.items[0],
    ]);
    expect(filterCommandGroups(groups, 'missing', 'local')).toEqual([]);
    expect(filterCommandGroups(groups, '', 'local')[0]?.items).toHaveLength(4);
  });
  it('ranks exact/prefix matches and preserves external result order', () => {
    const ranked = [
      {
        key: 'ranked',
        label: 'Ranked',
        items: [
          { key: 'middle', label: 'The guide' },
          { key: 'prefix', label: 'Guide advanced' },
          { key: 'exact', label: 'Guide' },
        ],
      },
    ];
    expect(
      filterCommandGroups(ranked, 'guide', 'local')[0]?.items.map((i) => i.key),
    ).toEqual(['exact', 'prefix', 'middle']);
    expect(filterCommandGroups(ranked, 'unmatched', 'external')[0]?.items).toEqual(
      ranked[0]?.items,
    );
  });
});

describe('global command result admission', () => {
  const earlier = Array.from({ length: COMMAND_POLICY.maximumResults }, (_, index) => ({
    key: `description-${index}`,
    label: 'Other',
    keywords: ['guide'],
  }));
  const later = [
    { key: 'prefix', label: 'Guide advanced' },
    { key: 'exact', label: 'Guide' },
  ];
  const candidates = [
    { key: 'early', label: 'Early', items: earlier },
    { key: 'late', label: 'Late', items: later },
  ];

  it('admits later exact and prefix matches before earlier description matches', () => {
    const visible = filterCommandGroups(candidates, 'guide', 'local');
    expect(visible.map((group) => group.key)).toEqual(['early', 'late']);
    expect(visible[0]?.items).toEqual(earlier.slice(0, -later.length));
    expect(visible[1]?.items.map((item) => item.key)).toEqual(['exact', 'prefix']);
    expect(visible.flatMap((group) => group.items)).toHaveLength(
      COMMAND_POLICY.maximumResults,
    );
  });

  it('keeps declared order across globally tied groups and external results', () => {
    const tied = [
      { key: 'first', label: 'First', items: earlier.slice(0, 2) },
      { key: 'second', label: 'Second', items: earlier.slice(2) },
      {
        key: 'last',
        label: 'Last',
        items: [{ key: 'last-item', label: 'Other guide' }],
      },
    ];
    expect(filterCommandGroups(tied, 'guide', 'local')).toEqual(tied.slice(0, 2));
    expect(filterCommandGroups(candidates, 'guide', 'external')).toEqual([
      candidates[0],
    ]);
  });
});
