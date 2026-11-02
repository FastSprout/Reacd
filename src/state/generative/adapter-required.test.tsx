import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdRenderer } from './renderer.js';

it('uses shadcn by default for a standalone legacy document', () => {
  render(
    <ReacdRenderer
      document={{
        schemaVersion: '0.1',
        templateId: 'saas-modern-light',
        root: { type: 'Text', content: 'Default legacy view' },
      }}
      actions={{}}
    />,
  );
  expect(
    screen.getByText('Default legacy view').closest('[data-adapter]'),
  ).toHaveAttribute('data-adapter', 'shadcn-ui');
  expect(screen.queryByRole('alert')).toBeNull();
});
