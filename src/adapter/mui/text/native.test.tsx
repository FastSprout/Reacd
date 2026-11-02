import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiText } from './text.adapter.js';
it('uses Material Typography variants and native no-wrap configuration', () => {
  render(
    <MuiText role="headline" weight="bold" lineLimit={1}>
      Heading
    </MuiText>,
  );
  expect(screen.getByRole('heading', { name: 'Heading' }).className).toContain(
    'MuiTypography-root',
  );
  expect(screen.getByText('Heading').className).toContain('MuiTypography-noWrap');
});

it('maps default typography and bounded multiline intent', () => {
  const view = render(<MuiText>Default</MuiText>);
  expect(screen.getByText('Default').className).toContain('MuiTypography-body1');
  view.rerender(
    <MuiText role="caption" weight="medium" lineLimit={2}>
      Bounded
    </MuiText>,
  );
  expect(screen.getByText('Bounded')).toHaveStyle({ WebkitLineClamp: '2' });
});
