import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnContentToc } from './content-toc.adapter.js';

it('maps the declared heading hierarchy to native SDK fragment links', () => {
  render(
    <ShadcnContentToc
      label="On this page"
      currentKey="usage"
      items={[
        { key: 'usage', label: 'Usage', children: [{ key: 'label', label: 'Label' }] },
      ]}
    />,
  );
  expect(screen.getByRole('link', { name: 'Usage' }).getAttribute('href')).toBe(
    '#usage',
  );
  expect(screen.getByRole('link', { name: 'Label' }).getAttribute('href')).toBe(
    '#label',
  );
});

it('shows a real empty outline and honors global disabled state', () => {
  const view = render(
    <ShadcnContentToc label="Contents" items={[]} emptyLabel="No headings" />,
  );
  expect(screen.getByText('No headings')).not.toBeNull();
  view.rerender(
    <ShadcnContentToc
      label="Contents"
      items={[{ key: 'api', label: 'API', disabled: true }]}
      disabled
    />,
  );
  expect(screen.getByRole('link', { name: 'API' }).getAttribute('href')).toBeNull();
});
