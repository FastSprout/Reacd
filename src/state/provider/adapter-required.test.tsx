import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { jsx } from '../../jsx-runtime.js';
import { Text } from '../../components/text/text.js';
import { ReacdProvider } from './provider.js';
import { UnsupportedAdapterComponentError } from
  '../../core/unsupported-adapter-component-error.js';
import type { AdapterSurfaceProps } from '../../renderer/contracts/theme-adapter.js';

it('selects shadcn when the application does not override its adapter', () => {
  render(
    <ReacdProvider>
      <Text>Default view</Text>
    </ReacdProvider>,
  );
  expect(screen.getByText('Default view').closest('[data-adapter]')).toHaveAttribute(
    'data-adapter',
    'shadcn-ui',
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('rejects an incomplete adapter instead of filling its missing controls', () => {
  expect(() =>
    render(
      jsx(ReacdProvider, {
        adapter: {
          id: 'incomplete',
          Surface: ({ children }: AdapterSurfaceProps) => children,
          components: {},
        },
        children: <Text>Incomplete view</Text>,
      }),
    ),
  ).toThrow(new UnsupportedAdapterComponentError('incomplete', 'Text'));
  expect(screen.queryByText('Incomplete view')).toBeNull();
});
