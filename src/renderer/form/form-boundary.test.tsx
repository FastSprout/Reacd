import { StrictMode } from 'react';
import { createPortal } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { TrustedFormBoundary } from './form-boundary.js';
import { FormScopeContext } from './form-scope.js';

afterEach(() => vi.restoreAllMocks());

it('rejects direct nesting before committing invalid native form markup', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const view = render(
    <StrictMode>
      <TrustedFormBoundary>
        <form aria-label="Outer form">
          <TrustedFormBoundary>
            <form aria-label="Nested form" />
          </TrustedFormBoundary>
        </form>
      </TrustedFormBoundary>
    </StrictMode>,
  );
  expect(screen.queryByRole('form', { name: 'Nested form' })).toBeNull();
  expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested');
  expect(view.container.querySelectorAll('form')).toHaveLength(1);
  expect(errors).not.toHaveBeenCalled();
  view.unmount();
  errors.mockRestore();
});

it('allows a portal form outside its semantic ancestor', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const host = document.createElement('div');
  document.body.appendChild(host);
  const view = render(
    <TrustedFormBoundary>
      <form aria-label="Outer form">
        {createPortal(
          <TrustedFormBoundary>
            <form aria-label="Portal form" />
          </TrustedFormBoundary>,
          host,
        )}
      </form>
    </TrustedFormBoundary>,
  );
  const portal = await screen.findByRole('form', { name: 'Portal form' });
  expect(screen.getByRole('form', { name: 'Outer form' }).contains(portal)).toBe(false);
  expect(host.querySelectorAll('form')).toHaveLength(1);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(errors).not.toHaveBeenCalled();
  view.unmount();
  host.remove();
  errors.mockRestore();
});

it('still rejects forms nested inside another form in the same portal', async () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const host = document.createElement('div');
  document.body.appendChild(host);
  const view = render(
    <TrustedFormBoundary>
      <form aria-label="Outer form">
        {createPortal(
          <TrustedFormBoundary>
            <form aria-label="Portal form">
              <TrustedFormBoundary>
                <form aria-label="Portal nested form" />
              </TrustedFormBoundary>
            </form>
          </TrustedFormBoundary>,
          host,
        )}
      </form>
    </TrustedFormBoundary>,
  );
  await screen.findByRole('form', { name: 'Portal form' });
  expect(screen.queryByRole('form', { name: 'Portal nested form' })).toBeNull();
  expect(host.querySelectorAll('form')).toHaveLength(1);
  expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested');
  expect(errors).not.toHaveBeenCalled();
  view.unmount();
  host.remove();
  errors.mockRestore();
});

it('hydrates unknown ancestry before allowing a native form', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  for (const inside of [false, true]) {
    const element = (
      <FormScopeContext.Provider value={inside}>
        <TrustedFormBoundary>
          <form aria-label="Hydrated form" />
        </TrustedFormBoundary>
      </FormScopeContext.Provider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    expect(container.querySelectorAll('form')).toHaveLength(inside ? 0 : 1);
    document.body.appendChild(container);
    const recoverable: unknown[] = [];
    const view = render(element, {
      container,
      hydrate: true,
      onRecoverableError: (error) => recoverable.push(error),
    });
    expect(screen.getByRole('form', { name: 'Hydrated form' })).toBeInTheDocument();
    expect(recoverable).toEqual([]);
    expect(errors).not.toHaveBeenCalled();
    view.unmount();
    container.remove();
  }
  errors.mockRestore();
});
