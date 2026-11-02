import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { colorPickerSchema } from '../../src/schema/color-picker/index.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { formSchema } from '../../src/schema/form/form.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { ColorPickerExample } from './color-picker.js';

it('reports native unavailability and preserves color veto/protection metadata', () => {
  expectUnsupportedExample(<ColorPickerExample />, 'ColorPicker');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <ColorPickerExample />
    </probe.Surface>,
  );
  const read = () => probe.read('ColorPicker', colorPickerSchema, 'Reference color');
  const toggle = (label: string) =>
    act(() => {
      const value = probe.read('Toggle', toggleSchema, label);
      value.onCheckedChange(!value.checked);
    });
  expect(read().value).toBe('#33aa6680');
  act(() => read().onValueChange('#000000ff'));
  expect(read().value).toBe('#000000ff');
  toggle('Reject color changes');
  act(() => read().onValueChange('#33aa6680'));
  expect(read().value).toBe('#000000ff');
  toggle('Read-only color');
  toggle('Disable color');
  expect(read().readOnly).toBe(true);
  expect(read().disabled).toBe(true);
  act(() => probe.read('Button', buttonSchema, 'Restore sample color').onPress());
  expect(read().value).toBe('#33aa6680');
  toggle('Disable color');
  toggle('Read-only color');
  toggle('Reject color changes');
  toggle('Right to left colors');
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  expect(read().readOnly).toBe(false);
  expect(read().disabled).toBe(false);
  act(() => probe.read('Form', formSchema, 'Color form').onSubmit());
  expect(probe.texts()).toContain('Color saved.');
});
