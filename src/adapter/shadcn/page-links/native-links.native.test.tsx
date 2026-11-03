import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ShadcnPageNativeLinks } from './native-links.js';
import { ShadcnText } from '../text/text.adapter.js';

for (const direction of ['ltr', 'rtl'] as const) {
  it(`retains complete leading labels and native ${direction} link focus`, async () => {
    render(
      <DirectionProvider dir={direction}>
        <ShadcnPageNativeLinks
          label="References"
          activeKey="local"
          links={[
            { key: 'local', label: 'Return to the running overview', href: '#local',
              leading: <ShadcnText>Local reference</ShadcnText> },
            { key: 'react', label: 'Read React documentation',
              href: 'https://react.dev', newWindow: true },
          ]}
        />
      </DirectionProvider>,
    );
    const local = screen.getByRole('link', {
      name: 'Local reference Return to the running overview',
    });
    const external = screen.getByRole('link', { name: 'Read React documentation' });
    expect(screen.getByRole('navigation', { name: 'References' }))
      .toHaveAttribute('dir', direction);
    expect(local).toHaveAttribute('data-slot', 'navigation-menu-link');
    expect(local).toHaveAttribute('aria-current', 'page');
    expect(local).toHaveAttribute('href', '#local');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    local.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(external).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(local).toHaveFocus());
  });
}
