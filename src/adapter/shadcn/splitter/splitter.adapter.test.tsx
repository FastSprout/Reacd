import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Splitter, ReacdProvider, Text, App } from '../../../index.js';
import type { SplitterProps } from '../../../components/splitter/index.js';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';

const PANELS = [
  {
    id: 'outline',
    label: 'Outline',
    content: <Text>Outline panel</Text>,
    minShare: 20,
    maxShare: 80,
    collapsedShare: 0,
  },
  {
    id: 'content',
    label: 'Content',
    content: <Text>Content panel</Text>,
    minShare: 20,
    maxShare: 100,
  },
];
const VALUE = [
  { id: 'outline', share: 50 },
  { id: 'content', share: 50 },
];
let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

function Scene({
  rtl = false,
  ...properties
}: Partial<SplitterProps> & {
  rtl?: boolean;
}) {
  const [value, setValue] = useState<SplitterProps['value']>(VALUE);
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Splitter
          label="Document panes"
          panels={PANELS}
          value={value}
          onValueChange={setValue}
          {...properties}
        />
      </App>
    </ReacdProvider>
  );
}

describe('Splitter keyboard and controlled layout', () => {
  it('supports constrained keyboard resizing and collapse/restore', async () => {
    const user = userEvent.setup();
    render(<Scene />);
    const handle = screen.getByRole('separator', { name: 'Outline' });
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle.getAttribute('aria-controls')?.split(' ')).toHaveLength(2);
    handle.focus();
    fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientX: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 200 });
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    await user.keyboard('{ArrowRight}');
    expect(handle).toHaveAttribute('aria-valuenow', '51');
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(handle).toHaveAttribute('aria-valuenow', '41');
    await user.keyboard('{End}');
    expect(handle).toHaveAttribute('aria-valuenow', '80');
    await user.keyboard('{Home}');
    expect(handle).toHaveAttribute('aria-valuenow', '20');
    await user.keyboard('{Enter}');
    expect(handle).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryByRole('region', { name: 'Outline' })).toBeNull();
    await user.keyboard('{Enter}');
    expect(handle).toHaveAttribute('aria-valuenow', '20');
    await user.keyboard('x{ArrowUp}');
    expect(handle).toHaveAttribute('aria-valuenow', '20');
  });

  it('inverts horizontal arrows in RTL and supports vertical keyboard movement', () => {
    const view = render(<Scene rtl />);
    let handle = screen.getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle).toHaveAttribute('aria-valuenow', '49');
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(handle).toHaveAttribute('aria-valuenow', '50');
    view.rerender(<Scene orientation="vertical" />);
    handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(handle).toHaveAttribute('aria-valuenow', '49');
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(handle).toHaveAttribute('aria-valuenow', '50');
  });

  it('honors disabled state, rejected changes and narrow reflow', () => {
    const change = vi.fn();
    const view = render(<Scene onValueChange={change} />);
    const handle = screen.getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(change).toHaveBeenCalledOnce();
    expect(handle).toHaveAttribute('aria-valuenow', '50');
    view.rerender(<Scene disabled onValueChange={change} />);
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(change).toHaveBeenCalledOnce();
    expect(handle).toHaveAttribute('aria-disabled', 'true');
    expect(handle).toHaveAttribute('tabindex', '-1');
    resizeContainers(240);
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.getByText('Outline panel')).toBeVisible();
    expect(screen.getByText('Content panel')).toBeVisible();
  });
});
