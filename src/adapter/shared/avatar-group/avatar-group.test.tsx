import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AvatarGroup, ReacdProvider } from '../../../index.js';

const items = [
  { id: 'a', name: 'Example Reader' },
  { id: 'b', name: 'Example Editor' },
  { id: 'c', name: 'Example Reviewer' },
];
describe('shadcn AvatarGroup', () => {
  it('reveals every hidden identity through a native disclosure', async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <AvatarGroup label="Reviewers" items={items} max={1} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('group', { name: 'Reviewers' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Example Reader' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Example Editor' })).not.toBeVisible();
    await user.click(screen.getByText('Show 2 more people'));
    expect(screen.getByRole('img', { name: 'Example Editor' })).toBeVisible();
    expect(screen.getByText('Example Reviewer', { exact: true })).toBeVisible();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <AvatarGroup label="Reviewers" items={items} max={2} size="small" />
      </ReacdProvider>,
    );
    expect(screen.getByText('Show 1 more person')).toBeInTheDocument();
  });
  it('handles empty, complete, custom empty-message, and replaced groups', () => {
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <AvatarGroup label="Reviewers" items={[]} />
      </ReacdProvider>,
    );
    expect(screen.getByText('No people to display.')).toBeInTheDocument();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <AvatarGroup label="Reviewers" items={[]} emptyMessage="Nobody assigned." />
      </ReacdProvider>,
    );
    expect(screen.getByText('Nobody assigned.')).toBeInTheDocument();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <AvatarGroup label="Reviewers" items={items} />
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('img')).toHaveLength(items.length);
    expect(screen.queryByText(/Show .* more/)).toBeNull();
  });
});
