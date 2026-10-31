import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm, ReacdProvider } from '../../../index.js';
import { AuthFormExample } from '../../../../docs/examples/auth-form.js';

describe('AuthForm app boundaries', () => {
  it('hydrates stable form semantics without duplicating submission', async () => {
    const submit = vi.fn();
    const tree = (
      <ReacdProvider adapter={shadcnAdapter}>
        <AuthForm
          label="Hydrated example"
          submitLabel="Submit hydration example"
          onSubmit={submit}
        />
      </ReacdProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(tree);
    document.body.append(container);
    const recover = vi.fn();
    const root = hydrateRoot(container, tree, { onRecoverableError: recover });
    await act(async () => {});
    fireEvent.submit(within(container).getByRole('form'));
    expect(submit).toHaveBeenCalledExactlyOnceWith();
    expect(recover).not.toHaveBeenCalled();
    await act(async () => root.unmount());
    container.remove();
  });

  it('keeps local credentials isolated across application providers', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ReacdProvider adapter={shadcnAdapter}>
          <AuthFormExample />
        </ReacdProvider>
        <ReacdProvider adapter={shadcnAdapter}>
          <AuthFormExample />
        </ReacdProvider>
      </>,
    );
    const fields = screen.getAllByRole('textbox');
    const first = fields[0];
    const second = fields[1];
    if (first === undefined || second === undefined)
      throw new Error('Missing isolated form fields.');
    await user.type(first, 'isolated@example.com');
    expect(first).toHaveValue('isolated@example.com');
    expect(second).toHaveValue('');
  });
});
