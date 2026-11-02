import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { nativeStructureEntries as entries } from './native-structure.js';

it('registers six native Material page compositions', () => {
  render(
    <>
      {entries.PageAside.render({ label: 'Related', children: 'Navigation' })}
      {entries.PageBody.render({ children: 'Article' })}
      {entries.PageColumns.render({ children: 'Columns' })}
      {entries.PageGrid.render({ children: 'Grid' })}
      {entries.PageList.render({ children: 'List' })}
      {entries.PageLogos.render({ label: 'Logos', items: [] })}
    </>,
  );
  expect(screen.getByRole('complementary', { name: 'Related' })).toBeVisible();
  expect(screen.getByRole('article')).toHaveTextContent('Article');
  expect(screen.getByText('Columns')).toBeVisible();
  expect(screen.getByText('Grid')).toBeVisible();
  expect(screen.getByRole('list')).toHaveTextContent('List');
  expect(screen.getByText('No logos to display.')).toBeVisible();
});
