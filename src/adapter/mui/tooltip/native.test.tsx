import { render, screen, waitFor } from '@testing-library/react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { MuiTooltip } from './tooltip.adapter.js';

it('uses Material Tooltip for hover and controlled notifications', async () => {
  const change = vi.fn<(open: boolean) => void>();
  render(
    <MuiTooltip text="Save changes" delay="none" arrow onOpenChange={change}>
      <Button>Save</Button>
    </MuiTooltip>,
  );
  await userEvent.hover(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Save changes');
  expect(change).toHaveBeenCalledWith(true);
  await userEvent.unhover(screen.getByRole('button', { name: 'Save' }));
  expect(change).toHaveBeenCalledWith(false);
});

it('preserves native uncontrolled state when disabled and enabled', async () => {
  const view = render(
    <MuiTooltip text="Help" delay="none" disabled>
      <Button>Help</Button>
    </MuiTooltip>,
  );
  await userEvent.hover(screen.getByRole('button', { name: 'Help' }));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await userEvent.unhover(screen.getByRole('button', { name: 'Help' }));
  view.rerender(
    <MuiTooltip text="Help" delay="none">
      <Button>Help</Button>
    </MuiTooltip>,
  );
  await userEvent.hover(screen.getByRole('button', { name: 'Help' }));
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Help');
  await userEvent.unhover(screen.getByRole('button', { name: 'Help' }));
});

it.each([
  ['ltr', 'inline-start', 'left'],
  ['rtl', 'inline-start', 'right'],
  ['ltr', 'inline-end', 'right'],
  ['rtl', 'inline-end', 'left'],
] as const)(
  'maps %s %s through Material placement',
  async (direction, placement, side) => {
    render(
      <ThemeProvider theme={createTheme({ direction })}>
        <MuiTooltip
          text="Save"
          shortcuts={['Ctrl', 'S']}
          placement={placement}
          open
          onOpenChange={() => undefined}
        >
          <Button>Save</Button>
        </MuiTooltip>
      </ThemeProvider>,
    );
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Save (Ctrl, S)');
    await waitFor(() => expect(tooltip).toHaveAttribute('data-popper-placement', side));
  },
);

it('suppresses portals and callbacks in inactive content', () => {
  render(
    <PortalActiveContext value={false}>
      <MuiTooltip text="Hidden" open onOpenChange={() => undefined}>
        <Button>Help</Button>
      </MuiTooltip>
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
