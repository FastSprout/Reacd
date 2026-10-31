import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it, vi } from 'vitest';
import { ChatReasoning, ChatShimmer, ChatTool, ReacdProvider } from '../../../index.js';

describe('chat feedback loading announcements', () => {
  it('never defers its own active Shimmer status', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <ChatShimmer text="Reading references" />
      </ReacdProvider>,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Reading references');
    expect(status.closest('[aria-busy="true"]')).toBeNull();
  });

  it('keeps reasoning and tool statuses outside their busy details', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <ChatReasoning
          label="Summary progress"
          text="Changing summary"
          open
          streaming
          onOpenChange={vi.fn()}
        />
        <ChatTool
          label="Tool progress"
          status="running"
          output="Changing output"
          open
          onOpenChange={vi.fn()}
        />
      </ReacdProvider>,
    );
    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(3);
    for (const status of statuses) {
      expect(status.closest('[aria-busy="true"]')).toBeNull();
    }
    for (const name of ['Summary progress', 'Tool progress']) {
      const trigger = screen.getByRole('button', { name });
      const controlled = trigger.getAttribute('aria-controls');
      const panel = screen
        .getAllByRole('region', { name })
        .find((region) => region.id === controlled);
      expect(panel).toHaveAttribute('aria-busy', 'true');
      expect(trigger).toHaveAttribute('aria-label', name);
    }
  });
});
