import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiPageLogos } from './page-logos.adapter.js';
it('uses native ImageList and preserves complete logo dimensions and failures', () => {
  const view = render(
    <MuiPageLogos
      label="Project logos"
      title="Projects"
      items={[{ key: 'workspace', src: '/workspace.svg', alt: 'Workspace' }]}
    />,
  );
  expect(screen.getByRole('list', { name: 'Project logos' }).className).toContain(
    'MuiImageList-root',
  );
  const image = screen.getByRole('img', { name: 'Workspace' });
  expect(image).toHaveAttribute('width', '160');
  expect(image).toHaveAttribute('height', '80');
  fireEvent.error(image);
  expect(screen.getByText('Image unavailable: Workspace')).toBeVisible();
  view.rerender(
    <MuiPageLogos
      label="Project logos"
      items={[{ key: 'workspace', src: '/replacement.svg', alt: 'Workspace' }]}
    />,
  );
  expect(screen.getByRole('img', { name: 'Workspace' })).toHaveAttribute(
    'src',
    '/replacement.svg',
  );
});
it('preserves native default and host-specific empty feedback', () => {
  const view = render(<MuiPageLogos label="Project logos" items={[]} />);
  expect(screen.getByText('No logos to display.')).toBeVisible();
  view.rerender(
    <MuiPageLogos label="Project logos" items={[]} emptyLabel="No project logos" />,
  );
  expect(screen.getByText('No project logos')).toBeVisible();
});
