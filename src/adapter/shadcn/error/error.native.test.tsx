import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnError } from './error.adapter.js';

it('uses SDK error presentation and native recovery navigation', () => {
  const view = render(
    <ShadcnError
      statusCode={404}
      title="Not found"
      message="This project is unavailable"
      redirect="/"
      leading="Icon"
      actions="Retry"
    >
      Details
    </ShadcnError>,
  );
  expect(screen.getByRole('region', { name: 'Not found' })).toHaveAttribute(
    'data-slot', 'empty',
  );
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByText('404')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
    'href',
    '/',
  );
  expect(screen.getByText('Details')).toBeVisible();
  view.rerender(<ShadcnError statusCode={500} title="Unavailable" />);
  expect(screen.getByRole('region', { name: 'Unavailable' })).toBeVisible();
  expect(screen.queryByRole('link')).toBeNull();
});
