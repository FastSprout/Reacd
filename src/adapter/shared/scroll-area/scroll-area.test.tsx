import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider, Button, Text } from '../../../index.js';
import { ScrollArea } from '../../../components/scroll-area/index.js';

it('preserves region focus and nested actions', async () => {
  const user = userEvent.setup();
  const press = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <ScrollArea label="Messages">
        <Text>Scrollable content</Text>
        <Button label="Open message" onPress={press} />
      </ScrollArea>
    </ReacdProvider>,
  );
  await user.tab();
  expect(screen.getByRole('region', { name: 'Messages' })).toHaveFocus();
  await user.tab();
  await user.keyboard('{Enter}');
  expect(press).toHaveBeenCalledOnce();
  for (const extent of ['small', 'medium', 'large'] as const) {
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter} templateId="erp-compact">
        <ScrollArea label="Messages" orientation="horizontal" extent={extent}>
          <Text>Scrollable content</Text>
          <Button label="Open message" onPress={press} />
        </ScrollArea>
      </ReacdProvider>,
    );
    expect(screen.getByRole('region', { name: 'Messages' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    await user.click(screen.getByRole('button', { name: 'Open message' }));
  }
  expect(press).toHaveBeenCalledTimes(4);
});
