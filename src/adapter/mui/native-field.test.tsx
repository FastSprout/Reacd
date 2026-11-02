import { render, screen, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { PortalActiveContext } from '../../renderer/theme/portal-context.js';
import { FieldMetadataContext } from '../../renderer/form-field/field-metadata.js';
import { useNativeField } from './native-field.js';

it('inherits metadata while blocking inactive SDK controls', () => {
  const { result } = renderHook(() => useNativeField({}), {
    wrapper: ({ children }) => (
      <PortalActiveContext value={false}>
        <FieldMetadataContext
          value={{
            name: 'contact',
            required: true,
            disabled: false,
            error: 'Invalid contact',
            descriptionIds: ['help'],
          }}
        >
          {children}
        </FieldMetadataContext>
      </PortalActiveContext>
    ),
  });
  expect(result.current).toMatchObject({
    disabled: true,
    blocked: true,
    required: true,
    name: 'contact',
    error: 'Invalid contact',
    descriptionIds: ['help'],
  });
});
it('keeps active metadata and explicit control options', () => {
  const { result } = renderHook(() => useNativeField({ disabled: true, name: 'a' }));
  expect(result.current.blocked).toBe(true);
  expect(result.current.name).toBe('a');
});

it('inherits a field error for the native Material inputs', () => {
  const { result } = renderHook(() => useNativeField({}), {
    wrapper: ({ children }) => (
      <FieldMetadataContext
        value={{
          name: undefined,
          required: false,
          disabled: false,
          error: 'Invalid value',
          descriptionIds: [],
        }}
      >
        {children}
      </FieldMetadataContext>
    ),
  });
  expect(result.current.error).toBe('Invalid value');
});

it.each([
  [
    'Input',
    <MuiInput key="Input" label="Field" value="" onValueChange={() => undefined} />,
  ],
  [
    'Textarea',
    <MuiTextarea
      key="Textarea"
      label="Field"
      value=""
      onValueChange={() => undefined}
    />,
  ],
  [
    'TextArea',
    <MuiTextArea
      key="TextArea"
      label="Field"
      value=""
      onValueChange={() => undefined}
    />,
  ],
  [
    'Checkbox',
    <MuiCheckbox
      key="Checkbox"
      label="Field"
      checked={false}
      onCheckedChange={() => undefined}
    />,
  ],
  [
    'Switch',
    <MuiSwitch
      key="Switch"
      label="Field"
      checked={false}
      onCheckedChange={() => undefined}
    />,
  ],
])('exposes inherited error feedback using native %s helper text', (_name, view) => {
  render(
    <FieldMetadataContext
      value={{
        name: 'field',
        required: true,
        disabled: false,
        error: 'Check this value',
        descriptionIds: [],
      }}
    >
      {view}
    </FieldMetadataContext>,
  );
  expect(screen.getByText('Check this value')).toBeVisible();
});

import { MuiInput } from './input/input.adapter.js';
import { MuiTextarea } from './textarea/textarea.adapter.js';
import { MuiTextArea } from './text-area/text-area.adapter.js';
import { MuiCheckbox } from './checkbox/checkbox.adapter.js';
import { MuiSwitch } from './switch/switch.adapter.js';
