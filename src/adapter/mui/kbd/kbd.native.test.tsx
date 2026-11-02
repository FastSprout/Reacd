import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiKbd } from './kbd.adapter.js';

it('preserves native keyboard semantics and presentation variants', () => {
  const view = render(<MuiKbd value="escape" />);
  const key = screen.getByLabelText('Escape');
  expect(key.tagName).toBe('KBD');
  expect(key.className).toContain('MuiChip-root');
  expect(key).toHaveTextContent('Esc');
  expect(key).not.toHaveAttribute('tabindex');
  view.rerender(<MuiKbd value="meta" platform="apple" label="Command key" />);
  expect(screen.getByLabelText('Command key')).toHaveTextContent('⌘');
  for (const size of ['small', 'medium', 'large'] as const) {
    for (const variant of ['outline', 'soft', 'subtle', 'solid'] as const) {
      for (const intent of ['secondary', 'primary', 'danger'] as const) {
        view.rerender(
          <MuiKbd value="Long literal" size={size} variant={variant} intent={intent} />,
        );
        expect(screen.getByLabelText('Long literal')).toHaveTextContent('Long literal');
      }
    }
  }
});
