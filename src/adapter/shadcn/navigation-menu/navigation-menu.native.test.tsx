import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnNavigationMenu } from './navigation-menu.adapter.js';

it('maps declared SDK links, grouped navigation and actions', () => {
  const action = vi.fn();
  render(
    <ShadcnNavigationMenu
      label="Main"
      items={[
        { key: 'home', label: 'Home', href: '/', active: true },
        { key: 'run', label: 'Run', onPress: action },
        {
          key: 'group',
          label: 'Guides',
          description: 'Reference',
          children: [{ key: 'api', label: 'API', href: '/api/', newWindow: true }],
        },
      ]}
    />,
  );
  expect(
    screen.getByRole('navigation', { name: 'Main' }).getAttribute('data-slot'),
  ).toBe('navigation-menu');
  expect(screen.getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe(
    'page',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Run' }));
  expect(action).toHaveBeenCalledExactlyOnceWith();
  fireEvent.click(screen.getByRole('button', { name: 'Guides' }));
  expect(screen.getByRole('link', { name: 'API' }).getAttribute('rel')).toBe(
    'noopener noreferrer',
  );
});

it('supports vertical SDK groups without inventing targets for text labels', () => {
  render(
    <ShadcnNavigationMenu
      label="Sections"
      orientation="vertical"
      items={[
        {
          key: 'group',
          label: 'Guides',
          children: [{ key: 'label', label: 'Overview' }],
        },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Guides' }));
  expect(screen.getByText('Overview')).not.toBeNull();
});

it('closes native disclosure after a logical action without forwarding events', () => {
  const action = vi.fn();
  render(<ShadcnNavigationMenu label="Actions" items={[{
    key: 'group', label: 'Resources', children: [
      { key: 'run', label: 'Open resource', onPress: action },
    ],
  }]} />);
  const trigger = screen.getByRole('button', { name: 'Resources' });
  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole('button', { name: 'Open resource' }));
  expect(action).toHaveBeenCalledExactlyOnceWith();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
