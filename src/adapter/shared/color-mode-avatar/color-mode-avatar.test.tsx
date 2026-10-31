import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { SharedColorModeAvatar } from './color-mode-avatar.adapter.js';

it('switches avatar sources and retains the name fallback', () => {
  const props = { name: 'Team account', light: '/light.png', dark: '/dark.png' };
  const view = render(<SharedColorModeAvatar {...props} mode="light" />);
  expect(screen.getByRole('img', { name: 'Team account' })).toHaveTextContent('TA');
  expect(view.container.querySelector('img')).toHaveAttribute('src', '/light.png');
  view.rerender(<SharedColorModeAvatar {...props} mode="dark" />);
  expect(view.container.querySelector('img')).toHaveAttribute('src', '/dark.png');
});
