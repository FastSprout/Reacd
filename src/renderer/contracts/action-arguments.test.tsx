import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Breadcrumb, FooterColumns, PageFeature, ReacdProvider } from '../../index.js';

it.each(['breadcrumb', 'footer', 'feature'] as const)(
  'keeps native event arguments behind the %s action boundary',
  async (kind) => {
    const action = vi.fn<(...args: unknown[]) => void>();
    const content = {
      breadcrumb: (
        <Breadcrumb
          label="Path"
          items={[{ key: 'action', label: 'Run action', onPress: action }]}
        />
      ),
      footer: (
        <FooterColumns
          label="Footer"
          columns={[
            {
              key: 'links',
              label: 'Links',
              children: [{ key: 'action', label: 'Run action', onPress: action }],
            },
          ]}
        />
      ),
      feature: <PageFeature title="Run action" onPress={action} />,
    }[kind];
    render(<ReacdProvider>{content}</ReacdProvider>);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Run action' }));
    expect(action).toHaveBeenCalledOnce();
    expect(action).toHaveBeenCalledWith();
  },
);
