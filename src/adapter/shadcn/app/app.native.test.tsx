import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnApp } from './app.adapter.js';

it('supplies SDK direction context and document language', () => {
  const view = render(<ShadcnApp>Content</ShadcnApp>);
  expect(screen.getByText('Content')).toHaveAttribute('dir', 'ltr');
  expect(screen.getByText('Content').classList).toContain('p-0');
  expect(screen.getByText('Content').classList).not.toContain('p-6');
  expect(screen.getByText('Content').classList).not.toContain('grid');
  view.rerender(
    <ShadcnApp direction="rtl" language="ar">
      Content
    </ShadcnApp>,
  );
  expect(screen.getByText('Content')).toHaveAttribute('dir', 'rtl');
  expect(screen.getByText('Content')).toHaveAttribute('lang', 'ar');
});
