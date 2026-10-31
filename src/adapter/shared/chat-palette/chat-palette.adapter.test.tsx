import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { SharedChatPalette } from './chat-palette.adapter.js';

it('names its conversation region and preserves independent prompt slots', () => {
  const view = render(
    <SharedChatPalette label="Conversation">Transcript</SharedChatPalette>,
  );
  expect(screen.getByRole('region', { name: 'Conversation' })).toHaveTextContent(
    'Transcript',
  );
  expect(view.container.querySelector('footer')).toBeNull();
  view.rerender(
    <SharedChatPalette label="Conversation" prompt="Composer">
      Transcript
    </SharedChatPalette>,
  );
  expect(view.container.querySelector('footer')).toHaveTextContent('Composer');
});
