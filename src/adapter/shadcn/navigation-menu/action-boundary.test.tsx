import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavigationMenu, ReacdProvider } from '../../../index.js';

describe('NavigationMenu action boundary', () => {
  it.each(['top', 'child'] as const)(
    'forwards no native detail to %s actions',
    async (location) => {
      const action = vi.fn();
      const user = userEvent.setup();
      render(
        <ReacdProvider>
          <NavigationMenu
            label="Logical actions"
            items={[
              { key: 'top', label: 'Top action', onPress: action },
              {
                key: 'group',
                label: 'Actions',
                children: [{ key: 'child', label: 'Child action', onPress: action }],
              },
            ]}
          />
        </ReacdProvider>,
      );
      if (location === 'child') {
        await user.click(screen.getByRole('button', { name: 'Actions' }));
      }
      await user.click(
        await screen.findByRole('button', {
          name: location === 'top' ? 'Top action' : 'Child action',
        }),
      );
      expect(action.mock.calls).toEqual([[]]);
    },
  );
});
