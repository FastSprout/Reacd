import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedInputNumber } from './input-number.adapter.js';
import { SharedCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
import { SharedInputRating } from '../input-rating/input-rating.adapter.js';

it('passes only logical number, group and rating callback values', async () => {
  const user = userEvent.setup();
  const number = vi.fn();
  const group = vi.fn();
  const rating = vi.fn();
  render(
    <>
      <SharedInputNumber label="Count" value={2} onValueChange={number} />
      <SharedCheckboxGroup
        label="Topics"
        value={[]}
        onValueChange={group}
        items={[{ value: 'news', label: 'News' }]}
      />
      <SharedInputRating label="Quality" value={2} onValueChange={rating} />
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
