import { atom, useAtom } from 'jotai';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { COMPONENT_NAMES } from '../../components/component-names.js';
import { Button, ReacdProvider, Text, VStack } from '../../index.js';
import { EXAMPLES } from '../../../test-support/adapter-examples/examples.js';
import { EXPECTED_UNSUPPORTED } from
  '../../../test-support/adapter-examples/native-capabilities.js';
import { UNSUPPORTED_DECLARATIONS } from
  '../../../test-support/adapter-examples/unsupported-declarations.js';
import { UnsupportedAdapterComponentError } from
  '../../core/unsupported-adapter-component-error.js';
import { shadcnAdapter } from '../shadcn/shadcn.adapter.js';
import { muiAdapter } from './mui.adapter.js';

it('matches the explicitly reviewed native catalog capabilities', () => {
  for (const [adapter, missing] of [
    [muiAdapter, EXPECTED_UNSUPPORTED['material-ui']],
    [shadcnAdapter, EXPECTED_UNSUPPORTED['shadcn-ui']],
  ] as const) {
    expect(new Set(missing).size).toBe(missing.length);
    expect(COMPONENT_NAMES).toEqual(expect.arrayContaining([...missing]));
    expect(Object.keys(adapter.components).sort()).toEqual(
      COMPONENT_NAMES.filter(name => !missing.includes(name)).sort(),
    );
  }
  expect(muiAdapter.id).toBe('material-ui');
});

function expectUnsupported(operation: () => unknown, name: string) {
  let failure: unknown;
  try { operation(); } catch (error) { failure = error; }
  expect(failure).toBeInstanceOf(UnsupportedAdapterComponentError);
  expect(failure).toMatchObject({
    name: 'UnsupportedAdapterComponentError',
    adapterId: 'material-ui',
    componentName: name,
    message: `Adapter "material-ui" does not support component "${name}".`,
  });
}

it.each(COMPONENT_NAMES)('exercises native or exact unsupported %s', (name) => {
  const unsupported = EXPECTED_UNSUPPORTED['material-ui'].includes(name);
  const example = unsupported
    ? UNSUPPORTED_DECLARATIONS[name] ?? EXAMPLES[name] : EXAMPLES[name];
  const declaration = (
    <ReacdProvider adapter={muiAdapter}>{example}</ReacdProvider>
  );
  if (unsupported) {
    expectUnsupported(() => render(declaration), name);
    expectUnsupported(() => renderToString(declaration), name);
    return;
  }
  const { container } = render(declaration);
  expect(container.querySelector('[data-adapter="material-ui"]')).toBeInTheDocument();
  expect(
    screen.queryByText('Unable to render this interface.', { exact: true }),
  ).not.toBeInTheDocument();
  if (name === 'Alert') {
    expect(screen.getByRole('alert')).toHaveTextContent('Information');
    expect(screen.getByRole('alert')).toHaveTextContent('Details');
  }
  const html = renderToString(declaration);
  expect(html).toContain('data-adapter="material-ui"');
  expect(html).not.toContain('Unable to render this interface.');
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
