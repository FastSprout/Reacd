import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { lazy } from 'react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider, Text } from '@fastsprout/reacd';
import { DeferredView } from './deferred-view.js';

describe('deferred workspace view', () => {
  it('shows a named loading status until the selected module resolves', async () => {
    type ViewModule = { default: () => ReactNode };
    let complete: (module: ViewModule) => void = () => {
      throw new Error('Not initialized.');
    };
    const pending = new Promise<ViewModule>((resolve) => {
      complete = resolve;
    });
    const View = lazy(() => pending);
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <DeferredView label="Fields">
          <View />
        </DeferredView>
      </ReacdProvider>,
    );
    expect(screen.getByRole('status', { name: 'Loading Fields' })).toBeInTheDocument();
    await act(async () => {
      complete({ default: () => <Text>Loaded fields</Text> });
    });
    expect(screen.getByText('Loaded fields')).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('isolates failed imports and resets on another view', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Failed = lazy(async () => {
      throw new Error('Failed module request.');
    });
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <DeferredView label="Fields">
          <Failed />
        </DeferredView>
        <Text>Workspace remains</Text>
      </ReacdProvider>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot load Fields');
    expect(screen.getByText('Workspace remains')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Reload workspace' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('alert')).toHaveTextContent('unsaved local changes');
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <DeferredView label="Layout">
          <Text>Other view</Text>
        </DeferredView>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Other view')).toBeInTheDocument();
    log.mockRestore();
  });
});
