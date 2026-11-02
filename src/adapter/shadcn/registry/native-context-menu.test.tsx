import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ContextMenu, defineThemeAdapter, ReacdProvider } from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativeContextMenuEntries } from './native-context-menu.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativeContextMenuEntries },
});

it('renders the closed declaration through its actual SDK entry', async () => {
  render(
    <ReacdProvider adapter={adapter}>
      <ContextMenu label="Record" open onOpenChange={() => undefined} items={[]}>
        Record content
      </ContextMenu>
    </ReacdProvider>,
  );
  expect(await screen.findByRole('menu', { name: 'Record' })).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('rejects unknown callback results without selecting an item', async () => {
  render(
    nativeContextMenuEntries.ContextMenu.render({
      label: 'Record',
      open: true,
      onOpenChange: () => undefined,
      children: 'Record',
      items: [
        {
          type: 'action',
          key: 'bad',
          label: 'Invalid callback',
          onPress: () => ({ invalid: true }),
        },
      ],
    }),
  );
  await userEvent.click(
    await screen.findByRole('menuitem', { name: 'Invalid callback' }),
  );
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Menu callbacks must return a boolean or no value.',
    ),
  );
  expect(screen.getByRole('menu')).toBeVisible();
});
