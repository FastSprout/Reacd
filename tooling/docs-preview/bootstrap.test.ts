import { createElement } from 'react';
import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
const { mount } = vi.hoisted(() => ({
  mount: vi.fn<(View: ComponentType) => string>(),
}));
vi.mock('../../src/state/bootstrap.js', () => ({ mountApplication: mount }));
vi.mock('./preview-app.js', () => ({
  DocumentationPreview: ({ search }: { search: string }) => search || 'Default request',
}));
it('mounts through the trusted bootstrap with the current query', async () => {
  mount.mockImplementation((View) => {
    render(createElement(View));
    return 'isolated root';
  });
  const result = await import('./bootstrap.js');
  expect(result.root).toBe('isolated root');
  expect(screen.getByText('Default request')).toBeInTheDocument();
  expect(mount).toHaveBeenCalledOnce();
});
