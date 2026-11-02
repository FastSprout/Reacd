import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChatPalette } from './chat-palette.adapter.js';
import { Button } from '../vendor/ui/button.js';

it('keeps SDK conversation viewport and prompt in separate normal-flow tracks', () => {
  const view = render(
    <ShadcnChatPalette label="Conversation" prompt={<Button>Send</Button>}>
      Messages
    </ShadcnChatPalette>,
  );
  expect(screen.getByRole('region', { name: 'Conversation' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Send' })).toBeVisible();
  expect(view.container.querySelector('[data-slot="scroll-area"]')).toBeTruthy();
  view.rerender(<ShadcnChatPalette label="Conversation">Messages</ShadcnChatPalette>);
  expect(screen.queryByRole('button')).toBeNull();
});
