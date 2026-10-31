import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Input, Popover, ReacdProvider } from '../../../index.js';

describe('Popover hover focus policy', () => {
  it.each([false, true])('opens modal=%s with the appropriate focus', async (modal) => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <ReacdProvider adapter={shadcnAdapter}>
          <Popover
            title="Hover panel"
            triggerLabel="Hover trigger"
            open={open}
            onOpenChange={setOpen}
            mode="hover"
            modal={modal}
            openDelay="none"
            closeDelay="none"
          >
            <Input label="Hover field" value="" onValueChange={() => undefined} />
          </Popover>
        </ReacdProvider>
      );
    }
    render(<Example />);
    const before = document.activeElement;
    await user.hover(screen.getByRole('button', { name: 'Hover trigger' }));
    await screen.findByRole('dialog', { name: 'Hover panel' });
    expect(document.activeElement).toBe(before);
    expect(screen.getByRole('dialog', { name: 'Hover panel' })).toHaveAttribute(
      'aria-modal',
      'false',
    );
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
