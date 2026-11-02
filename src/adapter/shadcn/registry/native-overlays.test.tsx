import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  defineThemeAdapter,
  ReacdProvider,
  Popover,
  Drawer,
  Slideover,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativeOverlayEntries } from './native-overlays.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativeOverlayEntries },
});

it.each([
  <Popover
    key="popover"
    title="Details"
    triggerLabel="Open"
    open
    onOpenChange={() => undefined}
  >
    Native content
  </Popover>,
  <Drawer
    key="drawer"
    title="Details"
    description="Description"
    open
    onOpenChange={() => undefined}
  >
    Native content
  </Drawer>,
  <Slideover
    key="slideover"
    title="Details"
    description="Description"
    open
    onOpenChange={() => undefined}
  >
    Native content
  </Slideover>,
])('renders the closed overlay declaration through its SDK entry %#', async (node) => {
  render(<ReacdProvider adapter={adapter}>{node}</ReacdProvider>);
  expect(await screen.findByRole('dialog', { name: 'Details' })).toBeVisible();
  expect(screen.getByText('Native content')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});
