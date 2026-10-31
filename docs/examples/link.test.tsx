import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { LinkExample } from './link.js';

it('documents current, new-window and unavailable navigation', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <LinkExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('link', { name: 'Current catalog' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    screen.getByRole('link', { name: 'Open catalog in new window' }),
  ).toHaveAttribute('rel', 'noopener noreferrer');
  expect(
    screen.getByRole('link', { name: 'Unavailable destination' }),
  ).not.toHaveAttribute('href');
});
