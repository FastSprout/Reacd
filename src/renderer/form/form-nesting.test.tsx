import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm, Form, ReacdProvider } from '../../index.js';
import { GenerativeUI } from '../../state/generative-ui/generative-ui.js';

function HiddenInnerForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <Form label="Nested form" onSubmit={onSubmit}>
      Inner content
    </Form>
  );
}

describe('native form nesting protection', () => {
  it('rejects nested forms even through a composed safe child', () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <ReacdProvider>
        <AuthForm label="Outer auth" submitLabel="Submit outer" onSubmit={outer}>
          <HiddenInnerForm onSubmit={inner} />
        </AuthForm>
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('form')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested.');
    fireEvent.submit(screen.getByRole('form'));
    expect(outer).toHaveBeenCalledExactlyOnceWith();
    expect(inner).not.toHaveBeenCalled();
  });

  it('rejects generated nested AuthForms in DOM and SSR', () => {
    const run = vi.fn();
    const document = {
      schemaVersion: '0.2',
      state: [],
      root: {
        type: 'AuthForm',
        label: 'Outer',
        submitLabel: 'Submit outer',
        submitAction: 'run',
        children: [
          {
            type: 'AuthForm',
            label: 'Inner',
            submitLabel: 'Submit inner',
            submitAction: 'run',
            children: [],
          },
        ],
      },
    };
    const tree = <GenerativeUI document={document} actions={{ run }} />;
    render(tree);
    expect(screen.getAllByRole('form')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Submit inner' })).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent('Forms cannot be nested.');
    expect(renderToString(tree).match(/<form\b/g)).toHaveLength(1);
    fireEvent.submit(screen.getByRole('form'));
    expect(run).toHaveBeenCalledOnce();
  });
});
