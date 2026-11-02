import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { nativeChatEntries as entries } from './native-chat.js';

it('registers all nine native SDK chat compositions', () => {
  render(
    <>
      {entries.ChatAttachment.render({ name: 'Report', mediaType: 'text/plain' })}
      {entries.ChatMessage.render({
        id: 'reply',
        author: 'Assistant',
        role: 'assistant',
        content: 'Reply',
      })}
      {entries.ChatMessages.render({ label: 'Transcript', messages: [] })}
      {entries.ChatPalette.render({ label: 'Palette', children: 'Conversation' })}
      {entries.ChatPrompt.render({
        label: 'Composer',
        value: '',
        onValueChange: vi.fn(),
        onSubmit: vi.fn(),
      })}
      {entries.ChatPromptSubmit.render({ label: 'Standalone send', onSubmit: vi.fn() })}
      {entries.ChatReasoning.render({
        text: 'Summary',
        open: false,
        onOpenChange: vi.fn(),
      })}
      {entries.ChatShimmer.render({ text: 'Progress' })}
      {entries.ChatTool.render({
        label: 'Lookup',
        status: 'pending',
        open: false,
        onOpenChange: vi.fn(),
      })}
    </>,
  );
  expect(screen.getByRole('article', { name: 'Assistant' })).toBeVisible();
  expect(screen.getByRole('log', { name: 'Transcript' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Palette' })).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Composer' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Standalone send' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Reasoning summary' })).toBeVisible();
  expect(screen.getByText('Progress')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Lookup' })).toBeVisible();
});
