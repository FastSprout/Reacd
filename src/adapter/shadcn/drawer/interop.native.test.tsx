import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnDrawer } from './drawer.adapter.js';
import { ShadcnModal } from '../modal/modal.adapter.js';

function Child() {
  const [open, change] = useState(false);
  return (
    <ShadcnDrawer
      title="Child drawer"
      description="Child details"
      open={open}
      onOpenChange={change}
      triggerLabel="Open child drawer"
    >
      Content
    </ShadcnDrawer>
  );
}
function Example() {
  const [open, change] = useState(true);
  return (
    <ShadcnModal
      title="Parent modal"
      description="Parent"
      open={open}
      onOpenChange={change}
    >
      <Child />
    </ShadcnModal>
  );
}
it('registers the SDK drawer with the native parent dismissal stack', async () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open child drawer' });
  await userEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Child drawer' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(screen.queryByRole('dialog', { name: 'Child drawer' })).toBeNull(),
  );
  expect(screen.getByRole('dialog', { name: 'Parent modal' })).toBeVisible();
  expect(trigger).toHaveFocus();
});
