import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider, templates } from '@fastsprout/reacd';
import { SiteApplication } from './site.js';
import { SiteHome } from './home.js';
import { sitePayload } from '../../../test-support/site-payload.js';

it(
  'switches the complete component gallery to working application templates',
  async () => {
    const user = userEvent.setup();
    render(
      <SiteApplication
        payload={{ ...sitePayload, page: { ...sitePayload.page, route: '/' } }}
        actions={{
          copyText: async () => undefined,
          readAppearance: () => 'light',
          persistAppearance: () => undefined,
        }}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Components and templates' }),
    ).toBeVisible();
    expect(screen.getByRole('group', { name: 'Theme preset' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Components' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(await screen.findByRole('region', { name: 'Contributors' })).toBeVisible();
    expect(screen.getByText('All examples use local sample data.')).toBeVisible();
    const cobalt = screen.getByRole('button', { name: 'Cobalt theme' });
    await user.click(cobalt);
    expect(cobalt).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('tab', { name: 'Templates' }));
    await user.click(await screen.findByRole('button', { name: 'Increment' }));
    expect(screen.getByText('Count: 1')).toBeVisible();
    await user.type(
      await screen.findByRole('textbox', { name: 'Contact name' }),
      'Avery',
    );
    await user.click(screen.getByRole('button', { name: 'Save contact' }));
    expect(await screen.findByText('Saved contact for Avery.')).toBeVisible();
    await user.type(
      await screen.findByRole('textbox', { name: 'Filter orders' }),
      'Ada',
    );
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
    expect(screen.queryByRole('cell', { name: 'Mina' })).toBeNull();
    for (const destination of [
      { name: 'Counter source', href: '/examples/counter/' },
      { name: 'Contact form source', href: '/examples/contact-form/' },
      { name: 'Orders dashboard source', href: '/examples/orders-dashboard/' },
    ])
      expect(screen.getByRole('link', { name: destination.name })).toHaveAttribute(
        'href',
        destination.href,
      );
    await user.click(screen.getByRole('tab', { name: 'Components' }));
    expect(await screen.findByRole('region', { name: 'Chat' })).toBeVisible();
  },
);

it('passes an explicit design to the gallery and every application template',
  async () => {
    const user = userEvent.setup();
    const design = templates['erp-compact'];
    render(<ReacdProvider>
      <SiteHome payload={sitePayload} appearance="light" design={design} />
    </ReacdProvider>);
    const connect = await screen.findByRole('button', { name: 'Connect account' });
    expect(connect.closest('[data-adapter="shadcn-ui"]'))
      .toHaveStyle({ '--primary': design.colors.primary });
    await user.click(screen.getByRole('tab', { name: 'Templates' }));
    for (const name of ['Increment', 'Save contact', 'Clear filters']) {
      const action = await screen.findByRole('button', { name });
      expect(action.closest('[data-adapter="shadcn-ui"]'))
        .toHaveStyle({ '--primary': design.colors.primary,
          '--space-medium': `${design.spacing.medium}rem` });
    }
  },
);
