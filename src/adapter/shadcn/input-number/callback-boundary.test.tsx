import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputNumber } from './input-number.adapter.js';
import { ShadcnCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
import { ShadcnInputRating } from '../input-rating/input-rating.adapter.js';

it('passes only logical number, group and rating callback values', async () => {
  const user = userEvent.setup();
  const number = vi.fn();
  const group = vi.fn();
  const rating = vi.fn();
  render(
    <>
      <ShadcnInputNumber label="Count" value={2} onValueChange={number} />
      <ShadcnCheckboxGroup
        label="Topics"
        value={[]}
        onValueChange={group}
        items={[{ value: 'news', label: 'News' }]}
      />
      <ShadcnInputRating label="Quality" value={2} onValueChange={rating} />
    </>,
  );
  await user.click(screen.getByRole('button', { name: 'Increase Count' }));
  expect(number.mock.calls).toEqual([[3]]);
  await user.click(screen.getByRole('checkbox', { name: 'News' }));
  expect(group.mock.calls).toEqual([[['news']]]);
  screen.getByRole('slider', { name: 'Quality' }).focus();
  await user.keyboard('{ArrowRight}');
  expect(rating.mock.calls).toEqual([[3]]);
});
