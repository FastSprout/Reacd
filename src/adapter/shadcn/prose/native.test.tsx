import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { expect, it } from 'vitest';
import { PROSE_DOCUMENT } from '../../../../test-support/prose-document.js';
import { HEADING_LEVELS } from '../../../core/heading-policy.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import { ShadcnProse } from './prose.adapter.js';

it('renders native typography and Table without HTML injection', () => {
  const view = render(<ShadcnProse document={PROSE_DOCUMENT} />);
  for (const level of HEADING_LEVELS) {
    expect(
      screen.getByRole('heading', { name: `Heading ${level}`, level }),
    ).toHaveAttribute('id', `heading-${level}`);
  }
  expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute(
    'href',
    '../guide/',
  );
  expect(view.container.querySelector('strong')).toHaveTextContent('strong');
  expect(view.container.querySelector('em')).toHaveTextContent('emphasis');
  expect(view.container.querySelector('del')).toHaveTextContent('deleted');
  expect(view.container.querySelector('blockquote')).toHaveTextContent(
    'Quoted paragraph',
  );
  expect(view.container.querySelector('ol')).toHaveAttribute('start', '3');
  expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  expect(
    screen.getByRole('columnheader', { name: 'Name' }).closest('table'),
  ).toHaveAttribute('data-slot', 'table');
  expect(screen.getByRole('cell', { name: 'Active' })).toBeVisible();
  expect(screen.getByRole('separator')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Project diagram' })).toHaveAttribute(
    'title',
    'Diagram',
  );
  expect(view.container.querySelector('script')).toBeNull();
  expect(view.container.textContent).toContain('<script>unsafe()</script>');
  expect(view.container.querySelector('pre code')?.textContent).toBe(
    'const value = 1;\n',
  );
  expect(screen.getByText('const')).toHaveStyle('color: #000000');
});
it('selects syntax colors from the scoped SDK theme, without a body class', () => {
  const variables: CSSProperties & Record<'--background', string> = {
    '--background': '#000000',
  };
  render(
    <ShadcnThemeContext value={variables}>
      <ShadcnProse document={PROSE_DOCUMENT} />
    </ShadcnThemeContext>,
  );
  expect(screen.getByText('const')).toHaveStyle('color: #ffffff');
});
