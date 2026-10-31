import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './app.js';

describe('component workbench', () => {
  it('loads navigation examples and changes their controlled values', async () => {
    const user = userEvent.setup();
    render(<App />);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Navigation' }));
      await import('./catalog/navigation-examples.js');
    });
    await user.click(await screen.findByRole('button', { name: 'Sample projects' }));
    expect(screen.getByText('Selected Sample projects locally.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Selected page: 2. Page size: 10.')).toBeInTheDocument();
  });
  it('filters component families and exposes a useful empty state', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'reacd' })).toBeInTheDocument();
    const search = screen.getByLabelText('Find components');
    await user.type(search, 'not-a-component');
    expect(screen.getByRole('status')).toHaveTextContent('No matching components');
    await user.clear(search);
    await user.type(search, 'input');
    expect(
      await screen.findByRole('heading', { name: 'Controlled fields' }),
    ).toBeInTheDocument();
    await user.clear(search);
    expect(screen.getByRole('button', { name: 'Fields' })).toBeInTheDocument();
  });

  it('edits controlled fields and saves local feedback', async () => {
    const user = userEvent.setup();
    render(<App />);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Fields' }));
      await import('./catalog/field-examples.js');
    });
    await user.click(await screen.findByLabelText('Name'));
    await user.paste('Example');
    await user.click(screen.getByLabelText('Email'));
    await user.paste('example@example.com');
    await user.click(screen.getByLabelText('Notes'));
    await user.paste('Notes');
    await user.click(screen.getByText('Receive updates'));
    await user.click(screen.getByRole('button', { name: 'Save example' }));
    expect(screen.getByText(/Saved locally: Example/)).toBeInTheDocument();
  });

  it('activates and resets examples without enabling disabled actions', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Actions and feedback' }));
    await user.click(await screen.findByRole('button', { name: 'Activate example' }));
    expect(screen.getByText('1 activations')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Disabled action' }));
    expect(screen.getByText('1 activations')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset activations' }));
    expect(screen.getByText('0 activations')).toBeInTheDocument();
  });

  it('retains the last valid generated view when JSON is invalid', async () => {
    const user = userEvent.setup();
    render(<App />);
    const tab = screen.getByRole('tab', { name: 'Generative UI' });
    await act(async () => {
      await user.click(tab);
      await import('./generative/playground.js');
    });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    await user.type(await screen.findByLabelText('Example note'), 'A note');
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(screen.getByText('Saved locally: A note')).toBeInTheDocument();
    const editor = screen.getByLabelText('JSON declaration');
    await user.clear(editor);
    await user.type(editor, 'invalid');
    await user.click(screen.getByRole('button', { name: 'Render declaration' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid declaration');
    expect(screen.getByLabelText('Example note')).toHaveValue('A note');
    await user.click(screen.getByRole('button', { name: 'Reset declaration' }));
    expect(screen.queryByRole('alert')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Render declaration' }));
    expect(screen.getByText('Generated example')).toBeInTheDocument();
    fireEvent.change(editor, {
      target: {
        value: JSON.stringify({
          schemaVersion: '0.2',
          state: [],
          root: { type: 'Button', label: 'Save note', action: 'saveExample' },
        }),
      },
    });
    await user.click(screen.getByRole('button', { name: 'Render declaration' }));
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(screen.getByText('Saved locally:')).toBeInTheDocument();
    expect(screen.queryByLabelText('Example note')).toBeNull();
    fireEvent.change(editor, {
      target: {
        value: JSON.stringify({
          schemaVersion: '0.2',
          state: [{ key: 'note', kind: 'number', initial: 1, access: 'readWrite' }],
          root: { type: 'Button', label: 'Save note', action: 'saveExample' },
        }),
      },
    });
    await user.click(screen.getByRole('button', { name: 'Render declaration' }));
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(screen.getByText('Saved locally:')).toBeInTheDocument();
  });

  it('renders every data state and restores ready data', async () => {
    const user = userEvent.setup();
    render(<App />);
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Content and data' }));
      await import('./catalog/data-examples.js');
    });
    expect(
      await screen.findByRole('table', { name: 'Example inventory' }),
    ).toBeInTheDocument();
    for (const state of ['Empty', 'Loading', 'Error', 'Ready']) {
      act(() => screen.getByRole('combobox', { name: 'Data state' }).focus());
      await user.keyboard('{ArrowDown}');
      await user.click(await screen.findByRole('option', { name: state }));
      if (state === 'Error') {
        expect(screen.getByRole('alert')).toHaveTextContent('Example failure');
      } else if (state === 'Ready') {
        expect(
          screen.getByRole('table', { name: 'Example inventory' }),
        ).toBeInTheDocument();
      } else {
        const message = state === 'Empty' ? 'No data available.' : 'Loading data…';
        expect(screen.getByText(message)).toHaveAttribute('role', 'status');
      }
    }
  });
});
