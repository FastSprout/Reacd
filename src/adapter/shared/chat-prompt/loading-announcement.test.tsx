import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen, within } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it, vi } from 'vitest';
import {
  ChatMessage,
  ChatPrompt,
  ChatShimmer,
  Modal,
  ReacdProvider,
} from '../../../index.js';

const attachment = {
  id: 'upload',
  name: 'Reference file',
  mediaType: 'text/plain',
  status: 'uploading',
} as const;

describe('ChatPrompt loading announcements', () => {
  it.each(['submitted', 'streaming'] as const)(
    'announces %s outside busy draft content',
    (status) => {
      render(
        <ReacdProvider adapter={activeTestAdapter}>
          <ChatPrompt
            label="Busy composer"
            value="Preserved draft"
            onValueChange={vi.fn()}
            onSubmit={vi.fn()}
            status={status}
            attachments={[attachment]}
            footer={<ChatShimmer text="Independent footer status" />}
          />
          <ChatShimmer text="Independent sibling status" />
        </ReacdProvider>,
      );
      const statuses = screen.getAllByRole('status');
      expect(statuses).toHaveLength(3);
      for (const element of statuses) {
        expect(element.closest('[aria-busy="true"]')).toBeNull();
      }
      expect(screen.getByText('Response in progress')).toHaveAttribute(
        'role',
        'status',
      );
      const draft = screen.getByRole('textbox', { name: 'Busy composer' });
      expect(draft.closest('[aria-busy="true"]')).not.toBeNull();
      const busy = draft.closest('[aria-busy="true"]');
      if (!(busy instanceof HTMLElement)) {
        throw new Error('Missing busy draft content.');
      }
      expect(within(busy).queryAllByRole('status')).toEqual([]);
      expect(within(busy).getByText('Uploading')).toBeVisible();
    },
  );

  it('keeps an independent footer portal announcement outside the draft scope', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <ChatPrompt
          label="Busy composer"
          value="Preserved draft"
          onValueChange={vi.fn()}
          onSubmit={vi.fn()}
          status="streaming"
          footer={
            <Modal
              title="Independent footer dialog"
              description="Independent streaming content."
              open
              onOpenChange={vi.fn()}
            >
              <ChatMessage
                id="portal-reply"
                author="Portal assistant"
                role="assistant"
                content="Changing independent response"
                status="streaming"
              />
            </Modal>
          }
        />
      </ReacdProvider>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Independent footer dialog' });
    const status = within(dialog).getByRole('status');
    expect(status).toHaveTextContent('Receiving response.');
    expect(status.closest('[aria-busy="true"]')).toBeNull();
    expect(within(dialog).getByText('Changing independent response')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});
