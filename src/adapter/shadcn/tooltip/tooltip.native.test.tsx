import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnTooltip } from './tooltip.adapter.js';
import { Button } from '../vendor/ui/button.js';
import { DirectionProvider } from '@radix-ui/react-direction';

it('delegates focus, hover and dismissal to the SDK tooltip', async () => {
  const change = vi.fn();
  render(
    <ShadcnTooltip text="Useful help" delay="none" onOpenChange={change}>
      <Button>Help</Button>
    </ShadcnTooltip>,
  );
  await userEvent.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Useful help');
  expect(change).toHaveBeenCalledWith(true);
  await userEvent.keyboard('{Escape}');
  expect(change).toHaveBeenCalledWith(false);
  expect(screen.queryByRole('tooltip')).toBeNull();
});

it('preserves controlled tooltip variants and SDK shortcuts', () => {
  const change = vi.fn();
  const view = render(
    <DirectionProvider dir="rtl">
      <ShadcnTooltip
        text="Help"
        open
        onOpenChange={change}
        placement="inline-start"
        arrow
        shortcuts={['Ctrl', 'K']}
      >
        <Button>Help trigger</Button>
      </ShadcnTooltip>
    </DirectionProvider>,
  );
  expect(screen.getByRole('tooltip')).toHaveTextContent('HelpCtrlK');
  expect(
    view.container.ownerDocument.querySelector('[data-slot=tooltip-content]'),
  ).toHaveAttribute('data-side', 'right');
  expect(screen.getAllByText('Ctrl')[0]).toHaveAttribute('data-slot', 'kbd');
  view.rerender(
    <ShadcnTooltip
      text="Help"
      open
      onOpenChange={change}
      placement="inline-end"
      disabled
    >
      <Button>Help trigger</Button>
    </ShadcnTooltip>,
  );
  expect(screen.queryByRole('tooltip')).toBeNull();
});

it('keeps disabled tooltips closed and allows SDK unmanaged state', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnTooltip text="Unavailable" delay="none" disabled onOpenChange={change}>
      <Button>Help</Button>
    </ShadcnTooltip>,
  );
  await userEvent.tab();
  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnTooltip text="Available" delay="none">
      <Button>Help</Button>
    </ShadcnTooltip>,
  );
  await userEvent.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Available');
});
