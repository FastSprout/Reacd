import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageAside } from './page-aside.adapter.js';
it('composes named native Card content in stable slot order', () => {
  render(
    <ShadcnPageAside label="Details" top="Before" bottom="After">
      Content
    </ShadcnPageAside>,
  );
  const aside = screen.getByRole('complementary', { name: 'Details' });
  expect(aside.textContent).toBe('BeforeContentAfter');
  expect(aside.className).toContain('md:sticky');
  expect(aside.className).toContain('p-0');
});
