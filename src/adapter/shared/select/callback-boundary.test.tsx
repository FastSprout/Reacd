import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { SharedSelect } from './select.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { SharedToggle } from '../toggle/toggle.adapter.js';

vi.mock('../primitives/switch.js', () => ({
  Switch: ({
    onCheckedChange,
  }: {
    onCheckedChange: (value: boolean, details: unknown) => void;
  }) => (
    <button
      role="switch"
      aria-checked="false"
      type="button"
      onClick={() => onCheckedChange(true, { source: 'vendor' })}
    >
      SDK switch
    </button>
  ),
}));
vi.mock('@base-ui/react/select', () => ({
  Select: {
    Root: ({
      onValueChange,
      children,
    }: {
      onValueChange: (value: string, details: unknown) => void;
      children: ReactNode;
    }) => (
      <>
        {children}
        <button
          type="button"
          onClick={() => onValueChange('two', { source: 'vendor' })}
        >
          SDK select
        </button>
      </>
    ),
    Trigger: ({ children }: { children: ReactNode }) => <>{children}</>,
    Value: ({ children }: { children: ReactNode }) => <>{children}</>,
    Item: ({ children }: { children: ReactNode }) => <>{children}</>,
    ItemIndicator: () => null,
    ItemText: ({ children }: { children: ReactNode }) => <>{children}</>,
  },
}));
vi.mock('./select-base-content.adapter.js', () => ({
  SharedBaseSelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

it('strips vendor event details from legacy Toggle', () => {
  const toggle = vi.fn();
  render(<SharedToggle label="Legacy" checked={false} onCheckedChange={toggle} />);
  fireEvent.click(screen.getByRole('switch'));
  expect(toggle.mock.calls).toEqual([[true]]);
});

it('strips vendor event details from Select', () => {
  const change = vi.fn();
  const element = (
    <SharedSelect
      label="Choice"
      value="one"
      onValueChange={change}
      items={[
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ]}
    />
  );
  const { rerender } = render(element);
  fireEvent.click(screen.getByRole('button', { name: 'SDK select' }));
  expect(change.mock.calls).toEqual([['two']]);
  rerender(<PortalActiveContext value={false}>{element}</PortalActiveContext>);
  fireEvent.click(screen.getByRole('button', { name: 'SDK select' }));
  expect(change.mock.calls).toEqual([['two']]);
});
