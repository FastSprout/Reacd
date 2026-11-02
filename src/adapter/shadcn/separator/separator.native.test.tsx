import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSeparator } from './separator.adapter.js';

it('uses SDK separators and gives a declared label priority over content', () => {
  const view = render(<ShadcnSeparator />);
  expect(screen.getByRole('separator')).toHaveAttribute(
    'aria-orientation',
    'horizontal',
  );
  view.rerender(<ShadcnSeparator label="Group">Unused children</ShadcnSeparator>);
  expect(screen.getByRole('separator', { name: 'Group' })).toBeVisible();
  expect(screen.queryByText('Unused children')).toBeNull();
  view.rerender(
    <ShadcnSeparator>
      <span>Child content</span>
    </ShadcnSeparator>,
  );
  expect(screen.getByText('Child content')).toBeVisible();
  for (const orientation of ['horizontal', 'vertical'] as const) {
    for (const position of ['start', 'center', 'end'] as const) {
      for (const size of ['small', 'medium', 'large'] as const) {
        view.rerender(
          <ShadcnSeparator
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
    <ShadcnSeparator
      orientation="vertical"
      intent="danger"
      lineStyle="dotted"
      decorative
    />,
  );
  expect(screen.queryByRole('separator')).toBeNull();
  view.rerender(<ShadcnSeparator label="Decorative content" decorative />);
  expect(screen.queryByRole('separator')).toBeNull();
});
