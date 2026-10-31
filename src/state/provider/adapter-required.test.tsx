import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { jsx } from '../../jsx-runtime.js';
import { Text } from '../../components/text/text.js';
import { ReacdProvider } from './provider.js';

it('reports the missing adapter instead of selecting a design system', () => {
  render(jsx(ReacdProvider, { children: <Text>Unavailable view</Text> }));
  expect(screen.getByRole('alert')).toHaveTextContent('ReacdProvider.adapter');
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid theme adapter.');
  expect(screen.queryByText('Unavailable view')).toBeNull();
});

it('rejects an incomplete adapter instead of filling its missing controls', () => {
  render(
    jsx(ReacdProvider, {
      adapter: { id: 'incomplete', Surface: () => null, components: {} },
      children: <Text>Incomplete view</Text>,
    }),
  );
  expect(screen.getByRole('alert')).toHaveTextContent('ReacdProvider.adapter');
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid theme adapter.');
  expect(screen.queryByText('Incomplete view')).toBeNull();
});
