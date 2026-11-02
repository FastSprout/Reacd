import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnPopover } from './popover.adapter.js';
import { ShadcnModal } from '../modal/modal.adapter.js';

function Child({ hover }: { hover: boolean }) {
  const [open, change] = useState(false);
  return (
    <ShadcnPopover
      title="Child popup"
      triggerLabel="Child details"
      open={open}
      onOpenChange={change}
      mode={hover ? 'hover' : 'click'}
      openDelay="none"
      closeDelay="none"
    >
      Content
    </ShadcnPopover>
  );
}
function Example({ hover }: { hover: boolean }) {
  const [open, change] = useState(true);
  return (
    <ShadcnModal
      title="Parent modal"
      description="Parent"
      open={open}
      onOpenChange={change}
    >
      <Child hover={hover} />
    </ShadcnModal>
  );
}
it.each([false, true])(
  'dismisses only the innermost SDK overlay, hover=%s',
  async (hover) => {
    render(<Example hover={hover} />);
    const trigger = screen.getByRole('button', { name: 'Child details' });
    if (hover) await userEvent.hover(trigger);
    else await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Child popup' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Child popup' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Parent modal' })).toBeVisible();
  },
);
