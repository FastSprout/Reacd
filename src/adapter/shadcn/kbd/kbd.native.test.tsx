import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnKbd } from './kbd.adapter.js';

it('uses native SDK keyboard notation with core aliases and no tab stop', () => {
  const view = render(<ShadcnKbd value="escape" />);
  const key = screen.getByLabelText('Escape');
  expect(key.tagName).toBe('KBD');
  expect(key).toHaveAttribute('data-slot', 'kbd');
  expect(key).toHaveTextContent('Esc');
  expect(key).not.toHaveAttribute('tabindex');
  view.rerender(<ShadcnKbd value="meta" platform="apple" label="Command key" />);
  expect(screen.getByLabelText('Command key')).toHaveTextContent('⌘');
  for (const size of ['small', 'medium', 'large'] as const) {
    for (const variant of ['outline', 'soft', 'subtle', 'solid'] as const) {
      for (const intent of ['secondary', 'primary', 'danger'] as const) {
        view.rerender(
          <ShadcnKbd
            value="Long literal"
            size={size}
            variant={variant}
            intent={intent}
          />,
        );
        expect(screen.getByLabelText('Long literal')).toHaveTextContent('Long literal');
      }
    }
  }
});
