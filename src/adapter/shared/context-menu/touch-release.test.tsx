import { createEvent, fireEvent, render, screen } from
  '../../../../test-support/adapter-testing.js';
import { activeTestAdapter } from
  '../../../../test-support/active-test-adapter.js';
import { expect, it, vi } from 'vitest';
import { ContextMenu, ReacdProvider } from '../../../index.js';

it.each([
  { open: false, disabled: false, prevented: false },
  { open: true, disabled: false, prevented: true },
  { open: true, disabled: true, prevented: false },
])('handles the opening touch release: $open/$disabled', ({
  open, disabled, prevented,
}) => {
  const action = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <ContextMenu
        label="Touch actions"
        open={open}
        disabled={disabled}
        onOpenChange={vi.fn()}
        items={[
          { type: 'action', key: 'archive', label: 'Archive', onPress: action },
        ]}
      />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('group', { hidden: true });
  const event = createEvent.touchEnd(trigger, { cancelable: true, touches: [] });
  fireEvent(trigger, event);
  expect(event.defaultPrevented).toBe(prevented);
  expect(action).not.toHaveBeenCalled();
});
