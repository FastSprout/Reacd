import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

it('renders safe generative adjacent links and rejects unsafe transport', () => {
  const document = {
    schemaVersion: '0.2',
    state: [],
    root: {
      type: 'ContentSurround',
      next: { title: 'Next reference', href: '/' },
    },
  };
  const view = render(<GenerativeUI adapter={shadcnAdapter} document={document} />);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  expect(
    renderToString(<GenerativeUI adapter={shadcnAdapter} document={document} />),
  ).toContain('Next reference');
  view.rerender(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        ...document,
        root: { ...document.root, next: { title: 'Unsafe', href: '//example.test' } },
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});
