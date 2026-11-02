import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnContainer } from './container.adapter.js';

it('uses the SDK responsive container configuration', () => {
  render(<ShadcnContainer>Content</ShadcnContainer>);
  expect(screen.getByText('Content').className).toContain('container');
});
