import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ReacdProvider, Text } from '@fastsprout/reacd';
import { PreviewBoundary } from './preview-boundary.js';

it.each([
  {
    failure: new Error('Adapter does not support this component.'),
    message: 'Adapter does not support this component.',
  },
  { failure: 'Chunk failed', message: 'The example could not load.' },
])(
  'contains preview failure while preserving the article: $message',
  ({ failure, message }) => {
    function Failing(): ReactNode {
      throw failure;
    }
    const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      render(
        <ReacdProvider>
          <Text>Article remains available.</Text>
          <PreviewBoundary name="Calendar">
            <Failing />
          </PreviewBoundary>
        </ReacdProvider>,
      );
      expect(screen.getByText('Article remains available.')).toBeVisible();
      expect(screen.getByRole('alert')).toHaveTextContent(message);
    } finally {
      diagnostic.mockRestore();
    }
  },
);
