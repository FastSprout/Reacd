import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnSlideover } from './slideover.adapter.js';
import { Input } from '../vendor/ui/input.js';

function Example() {
  const [open, change] = useState(false);
  return (
    <ShadcnSlideover
      title="Side panel"
      description="Panel details"
      open={open}
      onOpenChange={change}
      triggerLabel="Open panel"
      retainContent
    >
      <Input aria-label="Panel draft" defaultValue="Initial" />
    </ShadcnSlideover>
  );
}
it('uses Sheet native disclosure, retained child state and focus return', async () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open panel' });
  await userEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Side panel' })).toHaveAttribute(
    'data-slot',
    'sheet-content',
  );
  await userEvent.type(screen.getByRole('textbox', { name: 'Panel draft' }), ' saved');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  await userEvent.click(trigger);
  expect(screen.getByRole('textbox', { name: 'Panel draft' })).toHaveValue(
    'Initial saved',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('maps logical edge, fullscreen and nondismissible variants', async () => {
  const change = vi.fn();
  render(
    <DirectionProvider dir="rtl">
      <ShadcnSlideover
        title="Side panel"
        description="Details"
        open
        onOpenChange={change}
        placement="start"
        fullscreen
        overlay={false}
        dismissible={false}
        modal={false}
        footer="Panel footer"
      />
    </DirectionProvider>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Side panel' });
  expect(dialog).toHaveAttribute('data-side', 'right');
  expect(dialog.className).toContain('w-dvw');
  expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeNull();
  await userEvent.keyboard('{Escape}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByText('Panel footer')).toBeVisible();
});

it.each(['top', 'bottom', 'start', 'end'] as const)(
  'maps the declared logical %s edge and native outside dismissal',
  async (placement) => {
    const change = vi.fn();
    render(
      <>
        <button type="button">Outside</button>
        <ShadcnSlideover
          title="Panel"
          description="Details"
          open
          onOpenChange={change}
          placement={placement}
          modal={false}
          dismissible={false}
        >
          Content
        </ShadcnSlideover>
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(change).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(change).toHaveBeenCalledWith(false);
  },
);

it('allows native outside dismissal for nonmodal side panels', async () => {
  const change = vi.fn();
  render(
    <>
      <button type="button">Outside</button>
      <ShadcnSlideover
        title="Panel"
        description="Details"
        open
        onOpenChange={change}
        modal={false}
      >
        Content
      </ShadcnSlideover>
    </>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).toHaveBeenCalledWith(false);
});

it('aligns body controls with the native Sheet header and footer inset', () => {
  render(
    <ShadcnSlideover
      title="Preferences"
      description="Theme options"
      open
      onOpenChange={() => undefined}
    >
      <Input aria-label="Theme name" />
    </ShadcnSlideover>,
  );
  const body = screen.getByRole('textbox', { name: 'Theme name' }).parentElement;
  expect(body?.className.split(' ')).toContain('px-4');
  expect(body?.className.split(' ')).toContain('pb-0');
  expect(body?.className.split(' ')).toContain('min-w-0');
});
