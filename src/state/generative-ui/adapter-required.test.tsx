import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

it('uses shadcn by default for a standalone generative document', () => {
  render(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: { type: 'Text', content: 'Default generative view' },
      }}
    />,
  );
  expect(
    screen.getByText('Default generative view').closest('[data-adapter]'),
  ).toHaveAttribute('data-adapter', 'shadcn-ui');
  expect(screen.queryByRole('alert')).toBeNull();
});
