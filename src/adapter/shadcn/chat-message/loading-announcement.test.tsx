import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ChatMessage,
  ChatMessages,
  ChatShimmer,
  ReacdProvider,
} from '../../../index.js';

const message = {
  id: 'reply',
  author: 'Assistant',
  role: 'assistant',
  content: 'Changing reply text',
  status: 'streaming',
  attachments: [{ name: 'Reference', mediaType: 'text/plain', status: 'uploading' }],
} as const;

describe('Chat message loading announcements', () => {
  it('keeps standalone streaming and upload statuses outside busy content', () => {
    render(
      <ReacdProvider>
        <ChatMessage {...message} />
      </ReacdProvider>,
    );
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    for (const status of statuses) {
      expect(status.closest('[aria-busy="true"]')).toBeNull();
    }
    expect(screen.getByText(message.content)).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Reference')).toHaveAttribute('aria-busy', 'true');
  });

  it('uses transcript progress while preserving nested loading copy', () => {
    const independent = {
      ...message,
      id: 'independent',
      author: 'Independent assistant',
      content: 'Independent response',
      attachments: [],
    };
    const view = render(
      <ReacdProvider>
        <ChatMessages label="Busy transcript" messages={[message]} status="streaming" />
        <ChatMessage {...independent} />
        <ChatShimmer text="Independent sibling status" />
      </ReacdProvider>,
    );
    const log = screen.getByRole('log', { name: 'Busy transcript' });
    expect(log).toHaveAttribute('aria-busy', 'true');
    expect(within(log).queryAllByRole('status')).toEqual([]);
    expect(within(log).getByText('Uploading')).toBeVisible();
    expect(within(log).getByText('Receiving response.')).toBeVisible();
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(3);
    for (const status of statuses) {
      expect(status.closest('[aria-busy="true"]')).toBeNull();
    }
    view.rerender(
      <ReacdProvider>
        <ChatMessages label="Busy transcript" messages={[message]} status="ready" />
        <ChatMessage {...independent} />
        <ChatShimmer text="Independent sibling status" />
      </ReacdProvider>,
    );
    expect(log).toHaveAttribute('aria-busy', 'false');
    expect(within(log).getAllByRole('status')).toHaveLength(2);
  });
});
