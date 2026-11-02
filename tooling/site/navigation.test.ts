import { expect, it } from 'vitest';
import {
  currentNavigationKey,
  expandedNavigation,
  filterNavigation,
  searchGroups,
  sectionLinks,
} from './navigation.js';

const navigation = [
  {
    key: 'components',
    label: 'Components',
    children: [
      { key: 'button', label: 'Button', href: '/components/button/' },
      { key: 'grid', label: 'Grid', href: '/components/grid/' },
    ],
  },
];

it('filters navigation without losing the ancestry of matching links', () => {
  expect(filterNavigation(navigation, '')).toEqual(navigation);
  expect(filterNavigation(navigation, 'components')).toEqual(navigation);
  expect(filterNavigation(navigation, ' GrId ')).toEqual([
    {
      ...navigation[0],
      children: [navigation[0]?.children[1]],
    },
  ]);
  expect(filterNavigation(navigation, 'missing')).toEqual([]);
  expect(expandedNavigation(navigation)).toEqual(['components']);
});

it('groups search entries within the framework command item limit', () => {
  const pages = Array.from({ length: 101 }, (_, index) => ({
    route: `/page-${index}/`,
    title: `Page ${index}`,
    description: 'A page.',
  }));
  expect(searchGroups(pages).map((group) => group.items.length)).toEqual([100, 1]);
  expect(searchGroups([])).toEqual([]);
});

it('identifies the current nested destination without inventing a selected key', () => {
  expect(currentNavigationKey(navigation, '/components/grid/')).toBe('grid');
  expect(currentNavigationKey(navigation, '/missing/')).toBeUndefined();
});

it('links section tabs to declared destinations only', () => {
  expect(sectionLinks([...navigation, { key: 'empty', label: 'Empty' }])).toEqual([
    { key: 'components', label: 'Components', href: '/components/button/' },
  ]);
  expect(
    sectionLinks([
      {
        key: 'group',
        label: 'Group',
        children: [
          { key: 'empty', label: 'Empty', children: [] },
          { key: 'page', label: 'Page', href: '/page/' },
        ],
      },
    ]),
  ).toEqual([{ key: 'group', label: 'Group', href: '/page/' }]);
});
