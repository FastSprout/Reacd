import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import {
  act,
  render,
  screen,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { Button, Popover, ReacdProvider } from '../../../index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { SharedCarousel } from './carousel.adapter.js';
const items = [
  {
    id: 'details',
    label: 'Details',
    children: (
      <Popover
        title="Slide details"
        triggerLabel="Show slide details"
        open
        onOpenChange={() => undefined}
      >
        <Button label="Slide popup action" onPress={() => undefined} />
      </Popover>
    ),
  },
  { id: 'other', label: 'Other', children: 'Other slide' },
];
it('scopes slide portals and repairs their focus on host updates', async () => {
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedCarousel
        label="Portal slides"
        items={items}
        value={0}
        onValueChange={() => undefined}
      />
    </ReacdProvider>,
  );
  const popup = await screen.findByRole('dialog', { name: 'Slide details' });
  expect(popup.closest('[data-carousel-index="0"]')).not.toBeNull();
  act(() => {
    screen.getByRole('button', { name: 'Slide popup action' }).focus();
  });
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedCarousel
        label="Portal slides"
        items={items}
        value={1}
        onValueChange={() => undefined}
      />
    </ReacdProvider>,
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByRole('region', { name: 'Portal slides' })).toHaveFocus();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedCarousel
        label="Portal slides"
        items={items}
        value={0}
        onValueChange={() => undefined}
      />
    </ReacdProvider>,
  );
  expect(await screen.findByRole('dialog', { name: 'Slide details' })).toBeVisible();
});
it('preserves inactive ancestor portal scopes', () => {
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <PortalActiveContext.Provider value={false}>
        <SharedCarousel
          label="Suppressed slide portals"
          items={items}
          value={0}
          onValueChange={() => undefined}
        />
      </PortalActiveContext.Provider>
    </ReacdProvider>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});
