import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageAnchors } from './page-anchors.adapter.js';

it('preserves native fragment targets in the SDK navigation', () => {
  render(
    <ShadcnPageAnchors
      label="On this page"
      links={[{ key: 'usage', label: 'Usage', href: '#usage' }]}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'On this page' })).toBeVisible();
  expect(screen.getByRole('link')).toHaveAttribute('href', '#usage');
});
