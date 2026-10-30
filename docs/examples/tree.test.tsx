import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TreeExample } from './tree.js';
it('controls the documented tree through its closed API', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <TreeExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Expand Reference' }));
  await user.click(screen.getByRole('treeitem', { name: 'Architecture' }));
  expect(screen.getByText('Selected entries: architecture')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Multiple tree selection' }));
  await user.click(screen.getByRole('treeitem', { name: 'Guides' }));
  await user.click(screen.getByRole('treeitem', { name: 'Architecture' }));
  expect(
    screen.getByText('Selected entries: guides, architecture'),
  ).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Readonly tree transitions' }));
  expect(screen.getByRole('button', { name: 'Collapse Reference' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Right to left tree' }));
  expect(screen.getByRole('tree')).toHaveAttribute('data-direction', 'rtl');
  await user.click(screen.getByRole('switch', { name: 'Disable tree' }));
  expect(screen.getByRole('tree')).toHaveAttribute('aria-disabled', 'true');
  await user.clear(screen.getByLabelText('Tree item label'));
  expect(screen.getByRole('treeitem', { name: 'Architecture' })).toBeInTheDocument();
  await user.type(screen.getByLabelText('Tree item label'), 'Design');
  expect(screen.getByRole('treeitem', { name: 'Design' })).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Deep tree hierarchy' }));
  await user.click(screen.getByRole('button', { name: 'Expand sample hierarchy' }));
  expect(screen.getByRole('treeitem', { name: 'Design' })).toHaveAttribute(
    'aria-level',
    '14',
  );
  await user.click(screen.getByRole('switch', { name: 'Deep tree hierarchy' }));
  await user.click(screen.getByRole('button', { name: 'Expand sample hierarchy' }));
  expect(screen.getByRole('treeitem', { name: 'Design' })).toHaveAttribute(
    'aria-level',
    '2',
  );
});
