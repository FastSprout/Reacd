import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { atom, useAtom } from 'jotai';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App, Button, ReacdProvider, Text } from '../../../index.js';
import { Tree } from '../../../components/tree/tree.js';
import type { TreeProps } from '../../../components/tree/tree.js';

const items = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
      { id: 'branch', label: 'Branch', children: [{ id: 'delta', label: 'Delta' }] },
    ],
  },
  { id: 'zulu', label: 'Zulu', disabled: true },
  { id: 'omega', label: 'Omega' },
];
const valueAtom = atom<readonly string[]>([]);
const expandedAtom = atom<readonly string[]>([]);
function Example(properties: Partial<TreeProps>) {
  const [value, setValue] = useAtom(valueAtom);
  const [expanded, setExpanded] = useAtom(expandedAtom);
  return (
    <>
      <Tree
        label="Files"
        items={items}
        value={value}
        expanded={expanded}
        onValueChange={setValue}
        onExpandedChange={setExpanded}
        {...properties}
      />
      <Text>{`Selected: ${value.join(',')}`}</Text>
      <Button label="After tree" onPress={() => undefined} />
    </>
  );
}
function row(name: string) {
  return screen.getByRole('treeitem', { name });
}
describe('shadcn Tree', () => {
  it('navigates, expands and selects without coupling focus to selection', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example />
      </ReacdProvider>,
    );
    await user.tab();
    expect(row('Folder')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(row('Omega')).toHaveFocus();
    await user.keyboard('{Home}{ArrowRight}');
    expect(row('Folder')).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    expect(row('Alpha')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(row('Alpha')).toHaveFocus();
    expect(row('Alpha')).toHaveAttribute('aria-level', '2');
    expect(row('Alpha')).toHaveAttribute('aria-posinset', '1');
    expect(row('Alpha')).toHaveAttribute('aria-setsize', '3');
    await user.keyboard('{ArrowLeft}');
    expect(row('Folder')).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}{End}{ArrowUp}');
    expect(row('Folder')).toHaveFocus();
    expect(screen.queryByRole('treeitem', { name: 'Alpha' })).toBeNull();
    await user.keyboard('{Enter}');
    expect(row('Folder')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(row('Folder')).toHaveAttribute('aria-selected', 'true');
    await user.tab();
    expect(screen.getByRole('button', { name: 'After tree' })).toHaveFocus();
  });
  it('supports disclosure, multiple selection and readonly', async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example multiple />
      </ReacdProvider>,
    );
    screen.getByRole('button', { name: 'Expand Folder' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Selected:')).toBeInTheDocument();
    await user.click(row('Alpha'));
    await user.click(row('Beta'));
    expect(screen.getByText('Selected: alpha,beta')).toBeInTheDocument();
    await user.keyboard(' ');
    expect(screen.getByText('Selected: alpha')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Collapse Folder' }));
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example multiple selectionReadOnly expansionReadOnly />
      </ReacdProvider>,
    );
    await user.click(row('Omega'));
    expect(screen.getByText('Selected: alpha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand Folder' })).toBeDisabled();
    row('Folder').focus();
    await user.keyboard('{ArrowRight}');
    expect(row('Folder')).toHaveAttribute('aria-expanded', 'false');
    await user.click(row('Zulu'));
    expect(screen.getByText('Selected: alpha')).toBeInTheDocument();
  });
  it('handles typeahead, modifiers and RTL using the App context', async () => {
    const user = userEvent.setup();
    const clock = vi.spyOn(Date, 'now').mockReturnValue(100);
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <App direction="rtl">
          <Example />
        </App>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Expand Folder' }));
    row('Folder').focus();
    await user.keyboard('{ArrowLeft}');
    expect(row('Alpha')).toHaveFocus();
    await user.keyboard('b');
    expect(row('Beta')).toHaveFocus();
    await user.keyboard('r');
    expect(row('Branch')).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(row('Delta')).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(row('Branch')).toHaveFocus();
    clock.mockReturnValue(1000);
    await user.keyboard('a');
    expect(row('Alpha')).toHaveFocus();
    await user.keyboard('x{F2}');
    fireEvent.keyDown(row('Alpha'), { key: 'Enter', ctrlKey: true });
    fireEvent.keyDown(row('Alpha'), { key: 'Enter', altKey: true });
    fireEvent.keyDown(row('Alpha'), { key: 'Enter', metaKey: true });
    expect(screen.getByText('Selected:')).toBeInTheDocument();
    clock.mockRestore();
  });
  it('supports disabled and empty trees with a discoverable focus target', async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example disabled />
      </ReacdProvider>,
    );
    await user.tab();
    expect(screen.getByRole('tree', { name: 'Files' })).toHaveFocus();
    await user.click(row('Folder'));
    fireEvent.keyDown(row('Folder'), { key: 'Enter' });
    expect(screen.getByText('Selected:')).toBeInTheDocument();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example items={[]} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No items to display.');
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example items={[]} emptyLabel="No files" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No files');
  });
  it('requests transitions without overriding rejected host state', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const expand = vi.fn();
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Tree
          label="Files"
          items={items}
          value={['omega']}
          expanded={[]}
          onValueChange={select}
          onExpandedChange={expand}
        />
      </ReacdProvider>,
    );
    await user.tab();
    expect(row('Omega')).toHaveFocus();
    await user.click(row('Folder'));
    expect(select).toHaveBeenCalledWith(['folder']);
    expect(row('Omega')).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Expand Folder' }));
    expect(expand).toHaveBeenCalledWith(['folder']);
    expect(screen.queryByRole('treeitem', { name: 'Alpha' })).toBeNull();
  });
});
