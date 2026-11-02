import { act, fireEvent, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Form, Input, ReacdProvider } from '../../../index.js';
import { muiAdapter } from '../mui.adapter.js';

it('retains Material server form and input identity through hydration', async () => {
  const submit = vi.fn();
  const errors = vi.fn();
  const view = (
    <ReacdProvider adapter={muiAdapter}>
      <Form label="Server profile" onSubmit={submit}>
        <Input label="Name" value="Ada" onValueChange={vi.fn()} />
      </Form>
    </ReacdProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(view);
  document.body.append(container);
  const input = container.querySelector('input');
  const form = container.querySelector('form');
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, view, { onRecoverableError: errors });
    });
    expect(screen.getByRole('textbox', { name: 'Name' })).toBe(input);
    expect(screen.getByRole('form', { name: 'Server profile' })).toBe(form);
    fireEvent.submit(screen.getByRole('form', { name: 'Server profile' }));
    expect(submit).toHaveBeenCalledExactlyOnceWith();
    expect(errors).not.toHaveBeenCalled();
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});

it('server-renders and hydrates Material logical nesting diagnostics', async () => {
  const errors = vi.fn();
  const view = (
    <ReacdProvider adapter={muiAdapter}>
      <Form label="Outer" onSubmit={vi.fn()}>
        <Form label="Inner" onSubmit={vi.fn()} />
      </Form>
    </ReacdProvider>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(view);
  document.body.append(container);
  expect(container.querySelectorAll('form')).toHaveLength(1);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, view, { onRecoverableError: errors });
    });
    expect(screen.getAllByRole('form')).toHaveLength(1);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('MuiAlert-root');
    expect(alert).toHaveTextContent('Forms cannot be nested.');
    expect(errors).not.toHaveBeenCalled();
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});
