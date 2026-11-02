import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { nativeRatingEntries } from './native-rating.js';

it('registers the canonical rating with native shadcn Slider semantics', () => {
  render(
    nativeRatingEntries.InputRating.render({
      label: 'Quality',
      value: 2,
      onValueChange: vi.fn(),
    }),
  );
  expect(screen.getByRole('slider', { name: 'Quality' })).toHaveAttribute(
    'data-slot',
    'slider-thumb',
  );
});
