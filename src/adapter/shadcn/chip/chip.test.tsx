import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Chip, ReacdProvider, Text } from '../../../index.js';

describe('shadcn Chip', () => {
  it('preserves children and full indicator identity across host changes', async () => {
    const user = userEvent.setup();
    const press = vi.fn();
    const view = render(
      <ReacdProvider>
        <Chip label="Unread" text={42}>
          <Button label="Open messages" onPress={press} />
        </Chip>
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Unread: 42' })).toHaveAttribute(
      'title',
      'Unread: 42',
    );
    await user.click(screen.getByRole('button', { name: 'Open messages' }));
    expect(press).toHaveBeenCalledOnce();
    view.rerender(
      <ReacdProvider templateId="erp-compact">
        <Chip label="Unread" show={false}>
          <Button label="Open messages" onPress={press} />
        </Chip>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('img')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open messages' }));
    expect(press).toHaveBeenCalledTimes(2);
  });
  it('supports dots, standalone, logical corners, sizes, and intents', () => {
    const view = render(
      <ReacdProvider>
        <Chip label="Online">
          <Text>Example</Text>
        </Chip>
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Online' })).toHaveAttribute(
      'data-dot',
      'true',
    );
    for (const size of ['small', 'medium', 'large'] as const) {
      for (const intent of ['primary', 'secondary', 'danger'] as const) {
        view.rerender(
          <ReacdProvider>
            <Chip
              label="Count"
              text={0}
              standalone
              size={size}
              intent={intent}
              corner="bottom-start"
              inset
            />
          </ReacdProvider>,
        );
        expect(screen.getByRole('img', { name: 'Count: 0' })).toHaveTextContent('0');
      }
    }
    expect(screen.queryByText('Example')).toBeNull();
  });
});
