import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnMain } from './main.adapter.js';

it('places declared content in the native SDK main landmark', () => {
  render(<ShadcnMain>Application content</ShadcnMain>);
  expect(screen.getByRole('main')).toHaveTextContent('Application content');
});

it('keeps nested SDK main declarations inside one main landmark', () => {
  render(
    <ShadcnMain>
      <ShadcnMain>Nested content</ShadcnMain>
    </ShadcnMain>,
  );
  expect(screen.getAllByRole('main')).toHaveLength(1);
});
