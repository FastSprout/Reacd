import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { nativeRatingEntries } from './native-rating.js';

it('registers the canonical rating with native Material radio semantics', () => {
  render(
    nativeRatingEntries.InputRating.render({
      label: 'Quality',
      value: 2,
      onValueChange: vi.fn(),
    }),
  );
  expect(screen.getByRole('group', { name: 'Quality' })).toBeVisible();
  expect(screen.getByRole('radio', { name: '2 Stars' }))
    .toHaveProperty('checked', true);
});
