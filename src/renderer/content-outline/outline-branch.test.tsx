import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { OutlineBranch } from './outline-branch.js';
import { TREE_POLICY } from '../../core/tree-policy.js';

it('keeps a label-only branch controlled without inventing a link', async () => {
  const user = userEvent.setup();
  const expanded = vi.fn();
  const item = {
    key: 'topics',
    label: 'Topics',
    children: [{ key: 'chapter', label: 'Chapter', href: '/chapter' }],
  };
  const view = render(
    <ul>
      <OutlineBranch
        mode="navigation"
        item={item}
        level={TREE_POLICY.initialLevel}
        expandedKeys={[]}
        onExpandedKeysChange={expanded}
        report={() => undefined}
      />
    </ul>,
  );
  expect(screen.getByText('Topics')).toBeVisible();
  expect(screen.queryByRole('link')).toBeNull();
  const button = screen.getByRole('button', { name: 'Expand Topics' });
  const id = button.getAttribute('aria-controls');
  expect(id).toBeTruthy();
  await user.click(button);
  expect(expanded).toHaveBeenCalledExactlyOnceWith(['topics']);
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link')).toBeNull();
  view.rerender(
    <ul>
      <OutlineBranch
        mode="navigation"
        item={item}
        level={TREE_POLICY.initialLevel}
        expandedKeys={['topics']}
        onExpandedKeysChange={expanded}
        report={() => undefined}
      />
    </ul>,
  );
  expect(screen.getByRole('link', { name: 'Chapter' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Collapse Topics' })).toHaveAttribute(
    'aria-controls',
    id,
  );
});
