import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ReacdProvider, Toast } from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';

it('validates closed Toast declarations through the isolated native Surface', () => {
  render(<ReacdProvider adapter={shadcnAdapter}>
    <Toast title="Native registration" open duration="persistent"
      onOpenChange={() => undefined} />
  </ReacdProvider>);
  expect(screen.getByRole('dialog', { name: 'Native registration' }))
    .toHaveAttribute('data-radix-collection-item');
  expect(screen.getByRole('region', { name: 'Notifications' })).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('keeps Escape ownership isolated across actual application providers', () => {
  const first = vi.fn<() => false>(() => false);
  const second = vi.fn<() => void>();
  render(<>
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast title="First application" open duration="persistent"
        onOpenChange={first} />
    </ReacdProvider>
    <ReacdProvider adapter={shadcnAdapter}>
      <Toast title="Second application" open duration="persistent"
        onOpenChange={second} />
    </ReacdProvider>
  </>);
  const card = screen.getByRole('dialog', { name: 'First application' });
  card.focus();
  fireEvent.keyDown(card, { key: 'Escape' });
  expect(first).toHaveBeenCalledTimes(1);
  expect(second).not.toHaveBeenCalled();
  card.focus();
  fireEvent.keyDown(card, { key: 'Escape' });
  expect(first).toHaveBeenCalledTimes(2);
  expect(second).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Second application' })).toBeVisible();
  expect(screen.getAllByRole('region', { name: 'Notifications' })).toHaveLength(2);
});
