import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { ReacdProvider, UnsupportedAdapterComponentError } from '@fastsprout/reacd';
import { CoreFieldsExamples } from './core-fields-examples.js';
import { LayoutExamples } from './layout-examples.js';

it.each([shadcnAdapter, muiAdapter])(
  'keeps supported fields usable beside unsupported CodeEditor in $id',
  async (adapter) => {
    const errors: unknown[] = [];
    render(<ReacdProvider adapter={adapter}><CoreFieldsExamples /></ReacdProvider>, {
      onCaughtError: (error: unknown) => { errors.push(error); },
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toBeInstanceOf(UnsupportedAdapterComponentError);
    expect(errors[0]).toMatchObject({ adapterId: adapter.id,
      componentName: 'CodeEditor' });
    expect(screen.getByRole('alert')).toHaveTextContent('Cannot load CodeEditor');
    const notes = screen.getByRole('textbox', { name: 'Additional notes' });
    await userEvent.clear(notes);
    await userEvent.type(notes, 'Retained native notes');
    await userEvent.click(screen.getByRole('switch', { name: 'Email summaries' }));
    await userEvent.click(screen.getByRole('button', { name: 'Approve sample' }));
    expect(screen.getByText('Current notes: Retained native notes')).toBeVisible();
    expect(screen.getByText('Email summaries are enabled.')).toBeVisible();
    expect(screen.getByText('Approved samples: 1')).toBeVisible();
  },
);

it('isolates missing Material layout controls from supported native fixtures',
  async () => {
    const errors: unknown[] = [];
    render(<ReacdProvider adapter={muiAdapter}><LayoutExamples /></ReacdProvider>, {
      onCaughtError: (error: unknown) => { errors.push(error); },
    });
    for (const error of errors)
      expect(error).toBeInstanceOf(UnsupportedAdapterComponentError);
    for (const label of ['Spacer', 'Split view preview', 'Spacer example',
      'SplitView example', 'Viewport example'])
      expect(screen.getByText(`Cannot load ${label}`, { exact: true })).toBeVisible();
    const compact = screen.getByRole('switch', { name: 'Compact container' });
    await userEvent.click(compact);
    expect(screen.getByRole('switch', { name: 'Compact container', checked: true }))
      .toBe(compact);
    await userEvent.click(screen.getByRole('button', { name: 'Example notes' }));
    expect(screen.getByRole('textbox', { name: 'Panel note' })).toBeVisible();
    await userEvent.click(
      screen.getByRole('switch', { name: 'Show advanced settings' }),
    );
    expect(screen.getByText('Disclosure is open')).toBeVisible();
    expect(screen.getByText('Adjacent content stays in normal flow.')).toBeVisible();
    expect(screen.queryByText('Start of row')).not.toBeInTheDocument();
    expect(screen.getByText('Cannot load Error', { exact: true })).toBeVisible();
    const title = screen.getByRole('textbox', { name: 'Header title' });
    await userEvent.clear(title);
    await userEvent.type(title, 'Native header');
    expect(screen.getByRole('link', { name: 'Native header' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Run scoped action' }));
    expect(screen.getByText('Scoped actions: 1')).toBeVisible();
    expect(screen.getByText('Application content')).toBeVisible();
    expect(errors.length).toBeGreaterThan(0);
  },
);
