import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnContextMenu } from './context-menu.adapter.js';
import { ShadcnModal } from '../modal/modal.adapter.js';

function Example() {
  const [parent, setParent] = useState(true);
  const [open, change] = useState(false);
  return (
    <ShadcnModal
      title="Parent"
      description="Parent details"
      open={parent}
      onOpenChange={setParent}
    >
      <ShadcnContextMenu
        label="Record"
        open={open}
        onOpenChange={change}
        items={[
          { type: 'action', key: 'action', label: 'Action', onPress: () => undefined },
        ]}
      >
        Record
      </ShadcnContextMenu>
    </ShadcnModal>
  );
}
it('dismisses context content before its native parent dialog', async () => {
  render(<Example />);
  fireEvent.contextMenu(screen.getByRole('group', { name: 'Record' }));
  expect(await screen.findByRole('menu', { name: 'Record' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  expect(screen.getByRole('dialog', { name: 'Parent' })).toBeVisible();
});
