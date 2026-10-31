import { atom, useAtom } from 'jotai';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { COMPONENT_NAMES } from '../../components/component-names.js';
import { Button, ReacdProvider, Text, VStack } from '../../index.js';
import { EXAMPLES } from '../../../test-support/adapter-examples/examples.js';
import { shadcnAdapter } from '../shadcn/shadcn.adapter.js';
import { muiAdapter } from './mui.adapter.js';

it('implements exactly the complete reacd catalog', () => {
  expect(Object.keys(muiAdapter.components).sort()).toEqual(
    [...COMPONENT_NAMES].sort(),
  );
  expect(muiAdapter.id).toBe('material-ui');
});

it.each(COMPONENT_NAMES)('mounts and server-renders the %s declaration', (name) => {
  const declaration = (
    <ReacdProvider adapter={muiAdapter}>{EXAMPLES[name]}</ReacdProvider>
  );
  const { container } = render(declaration);
  expect(container.querySelector('[data-adapter="material-ui"]')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).toBeNull();
  expect(renderToString(declaration)).toContain('data-adapter="material-ui"');
});

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <VStack>
      <Text>{`Count: ${count}`}</Text>
      <Button label="Increment" onPress={() => setCount((value) => value + 1)} />
    </VStack>
  );
}

it('preserves isolated Jotai state while changing adapter and template', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Counter />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  view.rerender(
    <ReacdProvider adapter={muiAdapter} templateId="erp-compact">
      <Counter />
    </ReacdProvider>,
  );
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByText('Count: 2')).toBeInTheDocument();
});
