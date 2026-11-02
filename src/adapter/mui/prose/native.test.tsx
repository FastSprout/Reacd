import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { expect, it } from 'vitest';
import { PROSE_DOCUMENT } from '../../../../test-support/prose-document.js';
import { HEADING_LEVELS } from '../../../core/heading-policy.js';
import { MuiProse } from './prose.adapter.js';

it('renders complete structured Markdown with native Material semantics', () => {
  const view = render(<MuiProse document={PROSE_DOCUMENT} />);
  for (const level of HEADING_LEVELS) {
    const heading = screen.getByRole('heading', { name: `Heading ${level}`, level });
    expect(heading.className).toContain('MuiTypography-root');
    expect(heading).toHaveAttribute('id', `heading-${level}`);
  }
  expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute(
    'href',
    '../guide/',
  );
  expect(view.container.querySelector('strong')).toHaveTextContent('strong');
  expect(view.container.querySelector('strong')).toHaveStyle('font-weight: 700');
  expect(view.container.querySelector('em')).toHaveStyle('font-style: italic');
  expect(view.container.querySelector('em')).toHaveTextContent('emphasis');
  expect(view.container.querySelector('del')).toHaveTextContent('deleted');
  expect(view.container.querySelector('blockquote')).toHaveTextContent(
    'Quoted paragraph',
  );
  expect(view.container.querySelector('ol')).toHaveAttribute('start', '3');
  expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  expect(screen.getByRole('columnheader', { name: 'Name' }).className).toContain(
    'MuiTableCell-root',
  );
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
it('uses selected native theme mode for structured syntax token colors', () => {
  render(
    <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
      <MuiProse document={PROSE_DOCUMENT} />
    </ThemeProvider>,
  );
  expect(screen.getByText('const')).toHaveStyle('color: #ffffff');
});
