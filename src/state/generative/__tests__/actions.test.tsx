import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdRenderer } from '../../../index.js';
import type { ActionHandlers, ReacdNode } from '../../../index.js';
import { documentWith } from '../../../../test-support/documents.js';

describe('Generative rendering: actions', () => {
  it('preserves fields across themes and invokes typed actions', async () => {
    const user = userEvent.setup();
    const save = vi.fn<ActionHandlers[string]>();
    const document = documentWith({
      type: 'VStack',
      children: [
        { type: 'Input', id: 'name', label: 'Name', value: 'Initial' },
        {
          type: 'Input',
          id: 'email',
          label: 'Email',
          inputType: 'email',
          value: 'a@example.com',
          placeholder: 'Email',
          required: true,
        },
        { type: 'Button', label: 'Save', action: 'save' },
      ],
    });
    const { rerender, container } = render(
      <ReacdRenderer adapter={shadcnAdapter} document={document} actions={{ save }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).toHaveBeenLastCalledWith({
      values: { name: 'Initial', email: 'a@example.com' },
    });
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Edited');
    rerender(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={document}
        actions={{ save }}
        templateId="erp-compact"
      />,
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Edited');
    expect(container.querySelector('.reacd-root')).toHaveAttribute(
      'data-template',
      'erp-compact',
    );
    expect(container.querySelector('.reacd-root')).toHaveStyle(
      '--reacd-font-size: 0.875rem; --reacd-shadow: none',
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).toHaveBeenLastCalledWith({
      values: { name: 'Edited', email: 'a@example.com' },
    });
  });

  it('supports prototype-like keys and removes obsolete fields', () => {
    const save = vi.fn<ActionHandlers[string]>();
    const button: ReacdNode = { type: 'Button', label: 'Save', action: 'save' };
    const first = documentWith({
      type: 'VStack',
      children: [{ type: 'Input', id: 'constructor', label: 'Safe' }, button],
    });
    const { rerender } = render(
      <ReacdRenderer adapter={shadcnAdapter} document={first} actions={{ save }} />,
    );
    expect(screen.getByLabelText('Safe')).toHaveValue('');
    fireEvent.change(screen.getByLabelText('Safe'), { target: { value: 'Private' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).toHaveBeenLastCalledWith({ values: { constructor: 'Private' } });
    rerender(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith(button)}
        actions={{ save }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(save).toHaveBeenLastCalledWith({ values: {} });
  });

  it('isolates instances and gives labels unique identifiers', async () => {
    const user = userEvent.setup();
    const save = vi.fn<ActionHandlers[string]>();
    const document = documentWith({
      type: 'VStack',
      children: [
        { type: 'Input', id: 'value', label: 'Value', inputType: 'search' },
        { type: 'Button', label: 'Save', action: 'save' },
      ],
    });
    render(
      <>
        <ReacdRenderer adapter={shadcnAdapter} document={document} actions={{ save }} />
        <ReacdRenderer adapter={shadcnAdapter} document={document} actions={{ save }} />
      </>,
    );
    const inputs = screen.getAllByLabelText('Value');
    expect(new Set(inputs.map((input) => input.id)).size).toBe(2);
    const first = inputs.at(0);
    if (!first) throw new Error('Missing test input');
    await user.type(first, 'First only');
    expect(inputs.at(1)).toHaveValue('');
    await user.tab();
    expect(screen.getAllByRole('button', { name: 'Save' }).at(0)).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(save).toHaveBeenCalledWith({ values: { value: 'First only' } });
  });

  it('rejects missing, inherited, and non-function actions', () => {
    const document = documentWith({ type: 'Button', label: 'Run', action: 'run' });
    const { rerender } = render(
      <ReacdRenderer adapter={shadcnAdapter} document={document} actions={{}} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Action is not registered: run',
    );
    expect(screen.queryByRole('button')).toBeNull();
    rerender(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({ type: 'Button', label: 'Run', action: 'toString' })}
        actions={{}}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Action is not registered: toString',
    );
    const actions: ActionHandlers = {};
    Object.defineProperty(actions, 'run', { value: 'not-a-function' });
    rerender(
      <ReacdRenderer adapter={shadcnAdapter} document={document} actions={actions} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Action is not registered: run',
    );
  });

  it('does not call a handler removed by the host after rendering', () => {
    const handler = vi.fn<ActionHandlers[string]>();
    const actions: Record<string, ActionHandlers[string]> = { run: handler };
    render(
      <ReacdRenderer
        adapter={shadcnAdapter}
        document={documentWith({ type: 'Button', label: 'Run', action: 'run' })}
        actions={actions}
      />,
    );
    delete actions['run'];
    fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(handler).not.toHaveBeenCalled();
  });
});
