import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnScrollArea } from './scroll-area.adapter.js';

it('uses the SDK viewport with a labelled native keyboard target', () => {
  render(<ShadcnScrollArea label="References">All records</ShadcnScrollArea>);
  const region = screen.getByRole('region', { name: 'References' });
  expect(region.getAttribute('tabindex')).toBe('0');
  expect(region.hasAttribute('data-radix-scroll-area-viewport')).toBe(true);
  expect(screen.getByText('All records')).not.toBeNull();
});

it('uses bounded horizontal tracks without replacing SDK scrolling', () => {
  render(
    <ShadcnScrollArea label="Cards" orientation="horizontal" extent="large">
      Horizontal records
    </ShadcnScrollArea>,
  );
  expect(screen.getByRole('region', { name: 'Cards' }).getAttribute('tabindex')).toBe(
    '0',
  );
  expect(screen.getByText('Horizontal records').className).toContain(
    'reacd-scroll-track-horizontal',
  );
});
