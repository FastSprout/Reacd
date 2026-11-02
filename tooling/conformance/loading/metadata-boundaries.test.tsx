import { act, screen } from '@testing-library/react';
import type { Root } from 'react-dom/client';
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest';
import { UnsupportedAdapterComponentError } from '@fastsprout/reacd';

const captured = vi.hoisted(() => {
  const roots: Root[] = [];
  const errors: unknown[] = [];
  return { roots, errors };
});
vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom/client')>();
  return { ...actual, createRoot(
    container: Parameters<typeof actual.createRoot>[0],
    options: Parameters<typeof actual.createRoot>[1],
  ) {
    const root = actual.createRoot(container, { ...options,
      onCaughtError: (error: unknown) => { captured.errors.push(error); } });
    captured.roots.push(root);
    return root;
  } };
});
let host: HTMLElement | undefined;
beforeAll(() => window.localStorage.setItem('reacd-conformance-adapter', 'mui'));
afterAll(() => window.localStorage.clear());
afterEach(async () => {
  await act(async () => { captured.roots.forEach((root) => root.unmount()); });
  captured.roots.length = 0;
  captured.errors.length = 0;
  host?.remove();
  host = undefined;
  vi.restoreAllMocks();
});

it.each([
  ['editor', 'Editor metadata', 'Editor', 'material-ui'],
  ['listbox', 'Listbox metadata', 'Listbox', 'material-ui'],
] as const)('contains the %s fixture error for %s/%s/%s',
  async (entry, label, componentName, adapterId) => {
    host = document.createElement('div');
    host.id = 'root';
    document.body.append(host);
    await act(async () => {
      if (entry === 'editor')
        await import('../../../test-support/browser/editor-field-metadata.js');
      else await import('../../../test-support/browser/listbox-field-metadata.js');
    });
    expect(captured.errors[0]).toBeInstanceOf(UnsupportedAdapterComponentError);
    expect(captured.errors[0]).toMatchObject({ adapterId, componentName });
    expect(host.querySelector('[data-adapter]'))
      .toHaveAttribute('data-adapter', adapterId);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(`Cannot load ${label}`);
    expect(alert).toHaveTextContent(
      `Adapter "${adapterId}" does not support component "${componentName}".`,
    );
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
  },
);
