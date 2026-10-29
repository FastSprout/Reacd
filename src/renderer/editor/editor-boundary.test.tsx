import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { EditorBoundary } from './editor-boundary.js';

it('isolates a failed SDK startup with a truthful recovery diagnostic', () => {
  function UnavailableEditor(): ReactNode {
    throw new Error('SDK startup unavailable');
  }
  const caught = vi.fn();
  render(
    <EditorBoundary>
      <UnavailableEditor />
    </EditorBoundary>,
    {
      onCaughtError: caught,
    },
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Editor could not start');
  expect(screen.getByRole('alert')).toHaveTextContent('refresh the view');
  expect(caught).toHaveBeenCalledTimes(1);
});

it('preserves ordinary content without introducing a diagnostic', () => {
  render(
    <EditorBoundary>
      <span>Available editor</span>
    </EditorBoundary>,
  );
  expect(screen.getByText('Available editor')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('retries only its failed subtree using the latest host properties', async () => {
  function Session({ failed }: { failed: boolean }) {
    if (failed) throw new Error('SDK startup unavailable');
    return <span>Recovered latest editor</span>;
  }
  const view = render(<>
    <EditorBoundary><Session failed /></EditorBoundary>
    <span>Neighbor retained</span>
  </>, { onCaughtError: () => undefined });
  view.rerender(<>
    <EditorBoundary><Session failed={false} /></EditorBoundary>
    <span>Neighbor retained</span>
  </>);
  expect(screen.getByRole('alert')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Retry editor' }));
  expect(screen.getByText('Recovered latest editor')).toBeVisible();
  expect(screen.getByText('Neighbor retained')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});
