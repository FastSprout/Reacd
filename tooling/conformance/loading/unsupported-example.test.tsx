import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import {
  ReacdProvider,
  Text,
  UnsupportedAdapterComponentError,
} from '@fastsprout/reacd';
import { DeferredView } from './deferred-view.js';

it('keeps exact unsupported diagnostics and preserves supported siblings', () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  function UnsupportedExample(): never {
    throw new UnsupportedAdapterComponentError('shadcn-ui', 'CodeEditor');
  }
  try {
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <DeferredView label="CodeEditor">
          <UnsupportedExample />
        </DeferredView>
        <Text>Supported sibling</Text>
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Cannot load CodeEditor');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Adapter "shadcn-ui" does not support component "CodeEditor".',
    );
    expect(screen.getByText('Supported sibling')).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Reload workspace' })).toBeNull();
  } finally {
    log.mockRestore();
  }
});
