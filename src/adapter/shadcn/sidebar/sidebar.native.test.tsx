import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnSidebar } from './sidebar.adapter.js';

const props = {
  title: 'Workspace',
  open: true,
  onOpenChange: vi.fn(),
  mobileOpen: false,
  onMobileOpenChange: vi.fn(),
};
it('uses native Collapsible with slots and controlled intent', async () => {
  const view = render(
    <ShadcnSidebar
      {...props}
      narrow={false}
      header="Header"
      footer="Footer"
      actions="Actions"
      collapsedContent="Compact"
    >
      <input aria-label="Draft" defaultValue="Retained" />
    </ShadcnSidebar>,
  );
  const draft = screen.getByRole('textbox');
  expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeVisible();
  expect(screen.getByRole('complementary')).toHaveTextContent('HeaderActions');
  expect(screen.getByRole('complementary')).toHaveTextContent('Footer');
  await userEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));
  expect(props.onOpenChange).toHaveBeenCalledWith(false);
  view.rerender(
    <ShadcnSidebar
      {...props}
      open={false}
      narrow={false}
      collapsible="icon"
      collapsedContent="Compact"
    >
      <input aria-label="Draft" defaultValue="Retained" />
    </ShadcnSidebar>,
  );
  expect(screen.getByText('Compact')).toBeVisible();
  expect(view.container.querySelector('input')).toBe(draft);
  view.rerender(
    <ShadcnSidebar
      {...props}
      open={false}
      narrow={false}
      collapsible="none"
      variant="floating"
      side="end"
    >
      Always visible
    </ShadcnSidebar>,
  );
  expect(screen.getByText('Always visible')).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
});
it('uses native modal Sheet on mobile and isolates state callbacks', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSidebar
      {...props}
      narrow
      mobileOpen
      onMobileOpenChange={change}
      description="Project navigation"
      variant="inset"
      closeLabel="Close workspace"
    >
      Mobile content
    </ShadcnSidebar>,
  );
  expect(screen.getByRole('dialog', { name: 'Workspace' })).toBeVisible();
  expect(screen.getByText('Project navigation')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Close workspace' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(false);
  view.rerender(
    <ShadcnSidebar {...props} narrow disabled>
      Hidden
    </ShadcnSidebar>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('uses its SDK opener and never changes disabled mobile intent', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSidebar {...props} narrow mobileOpen={false} onMobileOpenChange={change}>
      Content
    </ShadcnSidebar>,
  );
  const button = screen.getByRole('button', { name: 'Toggle navigation' });
  await userEvent.click(button);
  expect(button).toHaveFocus();
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  view.rerender(
    <DirectionProvider dir="rtl">
      <ShadcnSidebar
        {...props}
        narrow
        mobileOpen
        disabled
        side="end"
        onMobileOpenChange={change}
      >
        Content
      </ShadcnSidebar>
    </DirectionProvider>,
  );
  await userEvent.keyboard('{Escape}');
  expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left');
  expect(screen.getByRole('dialog')).toHaveAttribute('dir', 'rtl');
});
it('uses container measurement and does not steal focus when docking', async () => {
  const view = render(<ShadcnSidebar {...props}>Content</ShadcnSidebar>);
  expect(screen.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
  view.rerender(
    <ShadcnSidebar {...props} narrow mobileOpen>
      Content
    </ShadcnSidebar>,
  );
  view.rerender(
    <ShadcnSidebar {...props} narrow={false} variant="inset">
      Docked
    </ShadcnSidebar>,
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByRole('complementary')).toHaveTextContent('Docked');
});
it('tolerates non-HTML or removed openers using native autofocus hooks', async () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('tabindex', '0');
  document.body.append(svg);
  svg.focus();
  const view = render(
    <ShadcnSidebar {...props} narrow mobileOpen side="end">
      Content
    </ShadcnSidebar>,
  );
  expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');
  view.rerender(
    <ShadcnSidebar {...props} narrow>
      Closed
    </ShadcnSidebar>,
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  svg.remove();
});

it('hides offcanvas content when the dashboard supplies its own opener', () => {
  render(
    <ShadcnSidebar {...props} narrow={false} open={false} showTrigger={false}>
      Offcanvas
    </ShadcnSidebar>,
  );
  expect(screen.queryByRole('complementary')).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
});
