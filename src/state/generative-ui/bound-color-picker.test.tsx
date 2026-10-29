import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { expect, it } from 'vitest';
import { BoundColorPicker } from './bound-color-picker.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { RenderContext } from '../../components/shared/port.js';
import { colorPickerEntries } from '../../adapter/shadcn/registry/color-picker.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { colorPickerNodeSchema } from '../../schema/color-picker/index.js';
import { success } from '../../../test-support/data-table.js';
const reference = { state: 'color', mode: 'readWrite' } as const;
const node = {
  type: 'ColorPicker',
  mode: 'rgb',
  label: 'Writer',
  value: reference,
} as const;
function Surface({ children }: { children: ReactNode }) {
  return (
    <RenderContext.Provider
      value={{
        render: (_name, props) => colorPickerEntries.ColorPicker.render(props),
        report: (issues) => <Issues issues={issues} />,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
}
it('shares canonical writes and constrains external updates', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'color', kind: 'text', initial: '#ff0000', access: 'readWrite' },
    ]),
  );
  const view = render(
    <Surface>
      <BoundColorPicker node={node} registry={registry} />
      <BoundColorPicker
        node={{
          ...node,
          label: 'Reader',
          value: {
            ...reference,
            mode: 'read',
          },
        }}
        registry={registry}
      />
    </Surface>,
  );
  expect(screen.getByRole('textbox', { name: 'Reader hexadecimal' })).toHaveAttribute(
    'readonly',
  );
  const hex = screen.getByRole('textbox', { name: 'Writer hexadecimal' });
  await user.clear(hex);
  await user.type(hex, '#ABCDEF{Enter}');
  expect(success(registry.read('color')).value).toBe('#abcdef');
  expect(screen.getByRole('textbox', { name: 'Reader hexadecimal' })).toHaveValue(
    '#abcdef',
  );
  act(() => {
    expect(registry.update('color', '#abcdef80').success).toBe(false);
  });
  view.unmount();
  expect(registry.update('color', 'host-owned').success).toBe(true);
  const isolated = success(
    createStateRegistry([
      { key: 'color', kind: 'text', initial: '#000000', access: 'readWrite' },
    ]),
  );
  expect(success(isolated.read('color')).value).toBe('#000000');
});
it('rejects missing, incompatible, malformed and protected writer states', () => {
  for (const definitions of [
    [],
    [{ key: 'color', kind: 'number', initial: 1, access: 'readWrite' }],
    [{ key: 'color', kind: 'text', initial: '#123456', access: 'read' }],
    [{ key: 'color', kind: 'text', initial: 'red', access: 'readWrite' }],
  ]) {
    const registry = success(createStateRegistry(definitions));
    const view = render(
      <Surface>
        <BoundColorPicker node={node} registry={registry} />
      </Surface>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    view.unmount();
  }
});
it('validates transport presets and rejects arbitrary styling or literal state', () => {
  expect(colorPickerNodeSchema.safeParse(node).success).toBe(true);
  for (const invalid of [
    { ...node, value: '#123456' },
    { ...node, style: {} },
    { ...node, presets: [{ label: 'Wrong mode', value: '#123456ff' }] },
  ])
    expect(colorPickerNodeSchema.safeParse(invalid).success).toBe(false);
});
