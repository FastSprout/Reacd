import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnToolbar } from './toolbar.adapter.js';

it('composes an explicitly named SDK action group', () => {
  render(<ShadcnToolbar label="Actions">Content</ShadcnToolbar>);
  expect(screen.getByRole('group', { name: 'Actions' }).className).toContain(
    'flex-wrap',
  );
});
