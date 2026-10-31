import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

it('reports an explicit missing adapter for a standalone generative document', () => {
  render(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'Hidden' },
      }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('GenerativeUI.adapter');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Select a complete theme adapter.',
  );
  expect(screen.queryByText('Hidden')).toBeNull();
});
