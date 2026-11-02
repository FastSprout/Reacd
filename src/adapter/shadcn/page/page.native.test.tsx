import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';
import { ShadcnPage } from './page.adapter.js';

let restore: (() => void) | undefined;
afterEach(() => {
  restore?.();
  restore = undefined;
});

it('keeps the title in the article and omits undeclared navigation rails', () => {
  const view = render(<ShadcnPage title="Orders">Content</ShadcnPage>);
  expect(screen.getByRole('heading', { name: 'Orders', level: 1 }).tagName).toBe('H1');
  expect(screen.queryByRole('complementary')).toBeNull();
  view.rerender(
    <ShadcnPage
      title="Orders"
      subtitle="Recent orders"
      anchor="orders"
      left="Side navigation content"
      right="Contents links"
    >
      Content
    </ShadcnPage>,
  );
  expect(screen.getByRole('heading', { name: 'Orders' }).id).toBe('orders');
  expect(screen.getByText('Recent orders')).toBeVisible();
  expect(screen.getByText('Side navigation content')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
  expect(screen.getByText('Side navigation content')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'On this page' }));
  expect(screen.getByText('Contents links')).toBeVisible();
  view.rerender(
    <ShadcnPage title="Orders" left="Side navigation content">
      Body
    </ShadcnPage>,
  );
  expect(screen.queryByRole('complementary', { name: 'On this page' })).toBeNull();
  view.rerender(
    <ShadcnPage title="Orders" right="Contents links">
      Body
    </ShadcnPage>,
  );
  expect(screen.queryByRole('complementary', { name: 'Navigation' })).toBeNull();
});

it('reflows retained rails without losing their user disclosure state', () => {
  restore = installLayout(1440);
  render(
    <ShadcnPage title="Orders" left="Documents" right="Headings">
      Body
    </ShadcnPage>,
  );
  expect(screen.getByText('Documents')).toBeVisible();
  expect(screen.getByText('Headings')).toBeVisible();
  resizeContainers(360);
  expect(screen.getByText('Documents')).not.toBeVisible();
  expect(screen.getByText('Headings')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
  resizeContainers(1440);
  resizeContainers(360);
  expect(screen.getByText('Documents')).toBeVisible();
});

it('preserves semantic server content and scoped nested heading levels', () => {
  render(
    <ShadcnPage title="Root">
      <ShadcnPage title="Nested">Body</ShadcnPage>
    </ShadcnPage>,
  );
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Root', level: 1 })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Nested', level: 2 })).toBeVisible();
  const html = renderToString(
    <ShadcnPage
      title="Orders"
      anchor="orders"
      left="All navigation retained"
      right="All heading links retained"
    >
      Body
    </ShadcnPage>,
  );
  expect(html).toContain('<h1');
  expect(html).toContain('All navigation retained');
  expect(html).toContain('All heading links retained');
  const server = document.createElement('div');
  server.innerHTML = html;
  document.body.append(server);
  expect(within(server).getByText('All navigation retained')).toBeVisible();
  expect(within(server).getByText('All heading links retained')).toBeVisible();
  server.remove();
});
