import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import {
  defineGenerativeDeclaration,
} from '../../schema/generative-v2/define-declaration.js';

const action = () =>
  ({
    type: 'Button',
    label: 'Local slot action',
    action: 'run',
  }) as const;
const root = () =>
  ({
    type: 'AuthForm',
    label: 'Generated local form',
    submitLabel: 'Submit local',
    submitAction: 'run',
    children: [action()],
    leading: [action()],
    header: [action()],
    footer: [action()],
    providers: [{ key: 'provider', label: 'Local provider', action: 'run' }],
  }) as const;
const declaration = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: root(),
});

describe('generative AuthForm', () => {
  it('visits every action and keeps callbacks logical', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(<GenerativeUI document={declaration} actions={{ run }} />);
    for (const button of screen.getAllByRole('button')) await user.click(button);
    expect(run).toHaveBeenCalledTimes(6);
    expect(run.mock.calls.every((args) => args.length === 1)).toBe(true);
  });

  it('prevalidates all content slots and provider/submit actions', () => {
    for (const slot of ['children', 'leading', 'header', 'footer']) {
      const view = render(
        <GenerativeUI
          document={{
            ...declaration,
            root: {
              ...root(),
              [slot]: [{ ...action(), action: 'missing' }],
            },
          }}
          actions={{ run: vi.fn() }}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      expect(screen.queryByRole('button')).toBeNull();
      view.unmount();
    }
    for (const extra of [
      { submitAction: 'missing' },
      { providers: [{ key: 'p', label: 'Provider', action: 'missing' }] },
    ]) {
      const view = render(
        <GenerativeUI
          document={{ ...declaration, root: { ...root(), ...extra } }}
          actions={{ run: vi.fn() }}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('not registered');
      view.unmount();
    }
  });

  it('reads independent boolean flags and blocks submit', () => {
    const run = vi.fn();
    const view = render(
      <GenerativeUI
        document={{
          ...declaration,
          state: [{ key: 'busy', kind: 'boolean', initial: true, access: 'readWrite' }],
          root: { ...root(), loading: { state: 'busy', mode: 'read' } },
        }}
        actions={{ run }}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Submitting');
    fireEvent.submit(screen.getByRole('form'));
    expect(run).not.toHaveBeenCalled();
    view.unmount();
    render(
      <GenerativeUI
        document={{
          ...declaration,
          state: [{ key: 'blocked', kind: 'boolean', initial: false, access: 'read' }],
          root: { ...root(), disabled: { state: 'blocked', mode: 'read' } },
        }}
        actions={{ run }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Submit local' })).not.toBeDisabled();
    fireEvent.submit(screen.getByRole('form'));
    expect(run).toHaveBeenCalledOnce();
  });

  it('renders no-provider literals and handles missing flag definitions', () => {
    const view = render(
      <GenerativeUI
        document={{
          ...declaration,
          root: {
            type: 'AuthForm',
            label: 'Minimal',
            submitLabel: 'Submit',
            submitAction: 'run',
            children: [],
            loading: false,
            disabled: false,
          },
        }}
        actions={{ run: vi.fn() }}
      />,
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
    view.unmount();
    render(
      <GenerativeUI
        document={{
          ...declaration,
          root: {
            ...root(),
            disabled: { state: 'missing', mode: 'read' },
          },
        }}
        actions={{ run: vi.fn() }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('never calls deleted or inherited registered actions', async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    const inherited = vi.fn();
    const actions = { run };
    render(<GenerativeUI document={declaration} actions={actions} />);
    Reflect.deleteProperty(actions, 'run');
    Object.setPrototypeOf(actions, { run: inherited });
    await user.click(screen.getByRole('button', { name: 'Local provider' }));
    fireEvent.submit(screen.getByRole('form'));
    expect(run).not.toHaveBeenCalled();
    expect(inherited).not.toHaveBeenCalled();
  });

  it('rejects mismatched kinds and writable display references', () => {
    for (const loading of [
      { state: 'wrong', mode: 'read' },
      { state: 'wrong', mode: 'readWrite' },
    ]) {
      const view = render(<GenerativeUI actions={{ run: vi.fn() }} document={{
        ...declaration,
        state: [{ key: 'wrong', kind: 'text', access: 'read', initial: 'false' }],
        root: { ...root(), loading },
      }} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('form')).toBeNull();
      view.unmount();
    }
  });
});
