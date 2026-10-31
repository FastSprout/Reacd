import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdRenderer } from './renderer.js';

it('reports an explicit missing adapter for a standalone legacy document', () => {
  render(
    <ReacdRenderer
      document={{
        schemaVersion: '0.1',
        templateId: 'saas-modern-light',
        root: { type: 'Text', content: 'Hidden' },
      }}
      actions={{}}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('ReacdRenderer.adapter');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Select a complete theme adapter.',
  );
  expect(screen.queryByText('Hidden')).toBeNull();
});
