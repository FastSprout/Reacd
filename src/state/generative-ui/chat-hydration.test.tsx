import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../index.js';
import { ChatAttachment } from '../../components/chat-attachment/index.js';
import { ChatMessage } from '../../components/chat-message/index.js';
import { ChatMessages } from '../../components/chat-messages/index.js';
import { ChatAttachmentExample } from '../../../docs/examples/chat-attachment.js';
import { ChatExamples } from '../../../demo/catalog/chat-examples.js';
import { createReacdStore } from '../store.js';

it('hydrates stable message identities in both template profiles', () => {
  for (const templateId of ['saas-modern-light', 'erp-compact']) {
    const element = (
      <ReacdProvider templateId={templateId}>
        <ChatAttachment name="Reference.txt" mediaType="text/plain" />
        <ChatMessage
          id="answer"
          author="Assistant"
          role="assistant"
          content="Response"
        />
        <ChatMessages label="Conversation" messages={[]} />
      </ReacdProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.appendChild(container);
    const labelledBy = screen.getByRole('article').getAttribute('aria-labelledby');
    const errors: unknown[] = [];
    const view = render(element, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby', labelledBy);
    expect(screen.getByRole('log')).toHaveTextContent('No messages yet.');
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  }
});

it('isolates host stores and renders every catalog preview', async () => {
  const first = createReacdStore();
  const second = createReacdStore();
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider store={first}>
      <ChatAttachmentExample />
    </ReacdProvider>,
  );
  await user.click(
    screen.getByRole('button', { name: 'Remove example-reference.txt' }),
  );
  expect(screen.getByText('Example attachment removed.')).toBeVisible();
  view.rerender(
    <ReacdProvider store={second}>
      <ChatExamples />
    </ReacdProvider>,
  );
  expect(screen.getByText('example-reference.txt')).toBeVisible();
  expect(screen.getByRole('log', { name: 'Example conversation' })).toBeVisible();
  view.rerender(
    <ReacdProvider store={first}>
      <ChatAttachmentExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Example attachment removed.')).toBeVisible();
});
