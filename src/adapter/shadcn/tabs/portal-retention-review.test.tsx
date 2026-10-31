import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Modal, ReacdProvider, Tabs, Text } from '../../../index.js';

it('deactivates a dialog when its retained panel becomes inactive', async () => {
  const change = vi.fn();
  function view(value: string) {
    return (
      <ReacdProvider adapter={shadcnAdapter}>
        <Tabs
          label="Panels"
          value={value}
          onValueChange={vi.fn()}
          items={[
            { value: 'first', label: 'First', content: <Text>Active content</Text> },
            {
              value: 'second',
              label: 'Second',
              content: (
                <Modal
                  title="Retained dialog"
                  description="Retained dialog content"
                  triggerLabel="Open retained dialog"
                  open
                  onOpenChange={change}
                >
                  <Text>Dialog content</Text>
                </Modal>
              ),
            },
          ]}
        />
      </ReacdProvider>
    );
  }
  const mounted = render(view('second'));
  expect(await screen.findByRole('dialog', { name: 'Retained dialog' })).toBeVisible();
  mounted.rerender(view('first'));
  await waitFor(() =>
    expect(
      screen.queryByRole('dialog', {
        name: 'Retained dialog',
      }),
    ).toBeNull(),
  );
  expect(change).not.toHaveBeenCalled();
  mounted.rerender(view('second'));
  expect(await screen.findByRole('dialog', { name: 'Retained dialog' })).toBeVisible();
  expect(change).not.toHaveBeenCalled();
});
