import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChatPalette } from './chat-palette.adapter.js';

it('names its conversation region and preserves independent prompt slots', () => {
  const view = render(
    <ShadcnChatPalette label="Conversation">Transcript</ShadcnChatPalette>,
  );
  expect(screen.getByRole('region', { name: 'Conversation' })).toHaveTextContent(
    'Transcript',
  );
  expect(view.container.querySelector('footer')).toBeNull();
  view.rerender(
    <ShadcnChatPalette label="Conversation" prompt="Composer">
      Transcript
    </ShadcnChatPalette>,
  );
  expect(view.container.querySelector('footer')).toHaveTextContent('Composer');
});
