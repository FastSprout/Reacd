import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { User } from '../../../components/user/user.js';

describe('shadcn User', () => {
  it('renders plain, linked and actionable identities', async () => {
    const user = userEvent.setup();
    const press = vi.fn();
    const view = render(
      <ReacdProvider>
        <User name="Ada Lovelace" />
      </ReacdProvider>,
    );
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
    view.rerender(
      <ReacdProvider>
        <User
          name="Ada Lovelace"
          description="Engineer"
          href="/people/ada"
          avatar={{ src: '/ada.png', fallback: 'AL' }}
          size="small"
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute(
      'href',
      '/people/ada',
    );
    expect(screen.getByRole('link')).toHaveAccessibleDescription('Engineer');
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute(
      'data-size',
      'small',
    );
    for (const size of ['medium', 'large'] as const) {
      view.rerender(
        <ReacdProvider templateId="erp-compact">
          <User
            name="Ada Lovelace"
            avatar={{}}
            size={size}
            orientation="vertical"
            onPress={press}
          />
        </ReacdProvider>,
      );
      const button = screen.getByRole('button', { name: 'Ada Lovelace' });
      expect(button).toHaveAttribute('data-orientation', 'vertical');
      await user.tab();
      button.focus();
      await user.keyboard('{Enter}');
    }
    expect(press).toHaveBeenCalledTimes(2);
    view.rerender(
      <ReacdProvider>
        <User name="Ada Lovelace" onPress={press} disabled />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
    await user.click(screen.getByRole('button'));
    expect(press).toHaveBeenCalledTimes(2);
  });
});
