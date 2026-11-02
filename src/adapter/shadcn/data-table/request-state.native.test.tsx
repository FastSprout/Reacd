import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ShadcnTable } from '../table/table.adapter.js';

it.each([
  { state: 'loading', active: true },
  { state: 'error', active: true },
  { state: 'ready', active: false },
] as const)('blocks table mutation while $state and active=$active',
  async ({ state, active }) => {
    const change = vi.fn();
    const retry = vi.fn();
    render(<PortalActiveContext.Provider value={active}>
      <ShadcnTable mode="interactive" caption="Pending orders" state={state}
        onModelChange={change} onRetry={retry}
        model={{
          columns: [{ key: 'name', label: 'Name', kind: 'text' }],
          rows: [
            { id: 'a', cells: { name: 'Alpha' } },
            { id: 'b', cells: { name: 'Beta' } },
          ],
          selection: [], sorting: [], filters: [],
          pagination: { pageIndex: 0, pageSize: 1 },
        }} />
    </PortalActiveContext.Provider>);
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(next).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort Name' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Filter Name' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeDisabled();
    await userEvent.click(next);
    expect(change).not.toHaveBeenCalled();
    if (state === 'error') {
      await userEvent.click(screen.getByRole('button', { name: 'Retry table' }));
      expect(retry).toHaveBeenCalledOnce();
    }
  });
