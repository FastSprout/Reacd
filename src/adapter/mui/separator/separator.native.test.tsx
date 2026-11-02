import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiSeparator } from './separator.adapter.js';

it('preserves native Divider semantics and content precedence', () => {
  const view = render(<MuiSeparator />);
  expect(screen.getByRole('separator').className).toContain('MuiDivider-root');
  expect(screen.getByRole('separator')).toHaveAttribute(
    'aria-orientation',
    'horizontal',
  );
  view.rerender(<MuiSeparator label="Group">Unused children</MuiSeparator>);
  expect(screen.getByRole('separator', { name: 'Group' })).toBeVisible();
  expect(screen.queryByText('Unused children')).toBeNull();
  view.rerender(
    <MuiSeparator>
      <span>Child content</span>
    </MuiSeparator>,
  );
  expect(screen.getByText('Child content')).toBeVisible();
  for (const orientation of ['horizontal', 'vertical'] as const) {
    for (const position of ['start', 'center', 'end'] as const) {
      for (const size of ['small', 'medium', 'large'] as const) {
        view.rerender(
          <MuiSeparator
            label="Group"
            orientation={orientation}
            position={position}
            size={size}
            lineStyle="dashed"
            intent="primary"
          />,
        );
        expect(screen.getByRole('separator')).toHaveAttribute(
          'aria-orientation',
          orientation,
        );
      }
    }
  }
  view.rerender(
    <MuiSeparator
      orientation="vertical"
      intent="danger"
      lineStyle="dotted"
      decorative
    />,
  );
  expect(screen.queryByRole('separator')).toBeNull();
});
