import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from './modal.adapter.js';
import { Input } from '../vendor/ui/input.js';

it('dismisses only the top native dialog and restores its own trigger', async () => {
  function Example() {
    const [parent, setParent] = useState(false);
    const [child, setChild] = useState(false);
    return (
      <ShadcnModal
        title="Parent"
        description="Parent details"
        triggerLabel="Open parent"
        retainContent
        open={parent}
        onOpenChange={setParent}
      >
        <ShadcnModal
          title="Child"
          description="Child details"
          triggerLabel="Open child"
          open={child}
          onOpenChange={setChild}
        >
          <Input aria-label="Child draft" />
        </ShadcnModal>
      </ShadcnModal>
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole('button', { name: 'Open parent' }));
  await userEvent.click(screen.getByRole('button', { name: 'Open child' }));
  const draft = screen.getByRole('textbox', { name: 'Child draft' });
  draft.focus();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: 'Child' })).toBeNull();
  expect(screen.getByRole('dialog', { name: 'Parent' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Open child' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Open parent' })).toHaveFocus();
});

it('keeps a nondismissible nonmodal dialog open during outside focus', async () => {
  const change = vi.fn();
  render(
    <>
      <Input aria-label="Outside draft" />
      <ShadcnModal
        title="Details"
        description="Nonmodal details"
        open
        modal={false}
        dismissible={false}
        onOpenChange={change}
      >
        Content
      </ShadcnModal>
    </>,
  );
  screen.getByRole('textbox', { name: 'Outside draft' }).focus();
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Details' })).toBeVisible();
});
