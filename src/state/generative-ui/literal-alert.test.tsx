import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

it('renders a static alert without registering a visibility binding', () => {
  const view = render(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: {
          type: 'Alert',
          title: 'Service status',
          message: 'Operational',
          intent: 'info',
        },
      }}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Operational');
  view.rerender(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: {
          type: 'Alert',
          title: 'Service status',
          message: 'Operational',
          intent: 'info',
          open: false,
        },
      }}
    />,
  );
  expect(screen.queryByRole('status')).toBeNull();
});
