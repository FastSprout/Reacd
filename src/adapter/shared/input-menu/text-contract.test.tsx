import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { act, render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';
import { inputMenuSchema } from '../../../schema/input-menu/index.js';
import { validateGenerativeDocument } from '../../../schema/generative-v2/index.js';
import { GenerativeUI } from '../../../state/generative-ui/generative-ui.js';
import { createStateRegistry } from '../../../state/registry/state-registry.js';

const properties = {
  label: 'Canonical text',
  items: [],
  value: '',
  onValueChange: () => undefined,
};
const node = {
  type: 'InputMenu',
  label: 'Canonical text',
  items: [],
  value: { state: 'text', mode: 'readWrite' },
};

it('rejects CR/LF in public TSX values instead of browser normalization', () => {
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu {...properties} value={'First\nSecond'} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('line breaks');
  expect(screen.queryByRole('combobox')).toBeNull();
  view.unmount();
  for (const value of ['First\rSecond', 'First\nSecond', 'First\r\nSecond']) {
    expect(inputMenuSchema.safeParse({ ...properties, value }).success).toBe(false);
    expect(
      inputMenuSchema.safeParse({
        ...properties,
        items: [{ value: 'a', label: value }],
      }).success,
    ).toBe(false);
  }
  for (const value of ['', '42', ' ', ' 42 ']) {
    expect(inputMenuSchema.safeParse({ ...properties, value }).success).toBe(true);
  }
});

it('rejects multiline JSON initial state through the same binding contract', () => {
  for (const initial of ['A\rB', 'A\nB', 'A\r\nB']) {
    expect(
      validateGenerativeDocument({
        schemaVersion: '0.2',
        root: node,
        state: [{ key: 'text', kind: 'text', access: 'readWrite', initial }],
      }).success,
    ).toBe(false);
  }
});

it('rejects multiline host/atomic writes but preserves accepted space text', () => {
  const state = [{ key: 'text', kind: 'text', access: 'readWrite', initial: '' }];
  const registry = createStateRegistry(state);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <GenerativeUI
      adapter={activeTestAdapter}
      document={{ schemaVersion: '0.2', state, root: node }}
      registry={registry.data}
    />,
  );
  act(() => {
    for (const value of ['A\rB', 'A\nB', 'A\r\nB']) {
      expect(registry.data.update('text', value).success).toBe(false);
      expect(registry.data.transaction([{ key: 'text', value }]).success).toBe(false);
    }
  });
  expect(registry.data.read('text')).toMatchObject({ data: { value: '' } });
  act(() => {
    expect(registry.data.update('text', ' 42 ').success).toBe(true);
  });
  expect(screen.getByRole('combobox', { name: 'Canonical text' })).toHaveValue(' 42 ');
});
