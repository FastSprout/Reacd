import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Form, Input, ReacdProvider } from '../../index.js';

it('keeps server form/control identity while checking hydrated ancestry', async () => {
  const submit = vi.fn();
  const errors = vi.fn();
  const view = (
    <ReacdProvider>
      <Form label="Server profile" onSubmit={submit}>
        <Input label="Name" value="Ada" onValueChange={vi.fn()} />
      </Form>
    </ReacdProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(view);
  document.body.append(container);
  const original = container.querySelector('input');
  const originalForm = container.querySelector('form');
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, view, { onRecoverableError: errors });
  });
  expect(screen.getByRole('textbox', { name: 'Name' })).toBe(original);
  expect(screen.getByRole('form', { name: 'Server profile' })).toBe(originalForm);
  fireEvent.submit(screen.getByRole('form', { name: 'Server profile' }));
  await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  expect(errors).not.toHaveBeenCalled();
  await act(async () => root?.unmount());
  container.remove();
});
it('hydrates logical nesting diagnostics without invalid markup', async () => {
  const errors = vi.fn();
  const view = (
    <ReacdProvider>
      <Form label="Outer" onSubmit={vi.fn()}>
        <Form label="Inner" onSubmit={vi.fn()}>
          Nested content
        </Form>
      </Form>
    </ReacdProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(view);
  document.body.append(container);
  expect(container.querySelectorAll('form')).toHaveLength(1);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, view, { onRecoverableError: errors });
  });
  expect(screen.getAllByRole('form')).toHaveLength(1);
  expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested.');
  expect(errors).not.toHaveBeenCalled();
  await act(async () => root?.unmount());
  container.remove();
});
