import { useContext, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnCollapsible } from './collapsible.adapter.js';

function Activity() {
  return <output>{String(useContext(PortalActiveContext))}</output>;
}
function Example() {
  const [open, change] = useState(false);
  return (
    <ShadcnCollapsible label="Details" open={open} onOpenChange={change}>
      Details content
    </ShadcnCollapsible>
  );
}

it('delegates controlled disclosure to the actual SDK', () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Details' });
  expect(trigger).toHaveAttribute('data-slot', 'collapsible-trigger');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('Details content')).toBeNull();
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('region', { name: 'Details' })).toBeVisible();
  fireEvent.click(trigger);
  expect(screen.queryByText('Details content')).toBeNull();
});

it('retains closed content without activating nested portals', () => {
  const change = vi.fn();
  const view = render(
    <ShadcnCollapsible label="Details" open={false} onOpenChange={change} retainContent>
      <Activity />
    </ShadcnCollapsible>,
  );
  expect(screen.getByText('false')).not.toBeVisible();
  view.rerender(
    <ShadcnCollapsible
      label="Details"
      open
      onOpenChange={change}
      retainContent
      showTrigger={false}
    >
      <Activity />
    </ShadcnCollapsible>,
  );
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.getByText('true')).toBeVisible();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnCollapsible label="Details" open onOpenChange={change} disabled>
        <Activity />
      </ShadcnCollapsible>
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button')).toBeDisabled();
  fireEvent.click(screen.getByRole('button'));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByText('false')).toBeVisible();
});
