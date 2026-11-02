import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { Root } from 'react-dom/client';
import { afterEach, expect, it, vi } from 'vitest';
import { renderSiteFailure } from './recovery.js';
import { SITE_POLICY } from '../policy.js';

const roots: Root[] = [];
afterEach(async () => {
  await act(async () => {
    for (const root of roots) root.unmount();
  });
  roots.length = 0;
  document.body.replaceChildren();
});

it('replaces the app with closed recovery and preserves metadata', async () => {
  const mount = document.createElement('div');
  mount.id = SITE_POLICY.rootId;
  mount.textContent = 'Previous static content';
  document.body.append(mount);
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = 'https://reacd.dev/getting-started/';
  document.head.append(canonical);
  const reload = vi.fn();
  await act(async () => {
    roots.push(renderSiteFailure(document, reload));
  });
  expect(screen.queryByText('Previous static content')).toBeNull();
  expect(screen.getByRole('alert')).toHaveTextContent('This page could not start');
  expect(document.querySelectorAll('[data-adapter="shadcn-ui"]')).toHaveLength(1);
  expect(canonical.href).toBe('https://reacd.dev/getting-started/');
  await userEvent.click(screen.getByRole('button', { name: 'Reload page' }));
  expect(reload).toHaveBeenCalledWith();
  canonical.remove();
});

it('replaces a malformed document body when the owned mount is absent', async () => {
  await act(async () => {
    roots.push(renderSiteFailure(document, vi.fn()));
  });
  expect(screen.getByRole('alert')).toBeVisible();
});
