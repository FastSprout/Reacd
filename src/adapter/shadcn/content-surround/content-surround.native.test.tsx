import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnContentSurround } from './content-surround.adapter.js';
it('uses safe native neighbor links and empty text', () => {
  const view = render(
    <ShadcnContentSurround
      previous={{ title: 'Earlier', href: '/' }}
      next={{ title: 'Later', href: '/next/', description: 'Details', newWindow: true }}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'Adjacent pages' })).toBeVisible();
  expect(screen.getByRole('link', { name: /Previous Earlier/ })).not.toHaveAttribute(
    'target',
  );
  expect(screen.getByRole('link', { name: /Next Later/ })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  view.rerender(<ShadcnContentSurround />);
  expect(screen.getByText('No adjacent pages.')).toBeVisible();
  expect(screen.queryByRole('link')).toBeNull();
  view.rerender(<ShadcnContentSurround label="Neighbors" emptyLabel="No neighbors" />);
  expect(screen.getByRole('navigation', { name: 'Neighbors' })).toBeVisible();
  expect(screen.getByText('No neighbors')).toBeVisible();
});
