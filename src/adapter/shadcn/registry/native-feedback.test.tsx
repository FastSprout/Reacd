import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { nativeFeedbackEntries as entries } from './native-feedback.js';

it('registers four native feedback compositions', () => {
  render(
    <>
      {entries.User.render({ name: 'Ada' })}
      {entries.Chip.render({ label: 'Online', standalone: true })}
      {entries.Timeline.render({
        label: 'Steps',
        items: [{ id: 'first', title: 'First' }],
      })}
      {entries.ProgressGroup.render({
        label: 'Storage',
        items: [{ id: 'apps', label: 'Applications', value: 20 }],
      })}
    </>,
  );
  expect(screen.getByText('Ada')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Online' })).toBeVisible();
  expect(screen.getByRole('list', { name: 'Steps' })).toBeVisible();
  expect(screen.getByRole('progressbar', { name: 'Storage' })).toBeVisible();
});
