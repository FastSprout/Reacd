import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { nativeNavigationContentEntries as entries } from
  './native-navigation-content.js';

it('registers all three canonical closed components using native SDK entries', () => {
  render(
    <>
      {entries.Breadcrumb.render({
        label: 'Path',
        items: [{ key: 'current', label: 'Here' }],
      })}
      {entries.Kbd.render({ value: 'escape' })}
      {entries.Separator.render({ label: 'Boundary' })}
    </>,
  );
  expect(screen.getByRole('navigation', { name: 'Path' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'Escape' })).toBeVisible();
  expect(screen.getByRole('separator', { name: 'Boundary' })).toBeVisible();
});
