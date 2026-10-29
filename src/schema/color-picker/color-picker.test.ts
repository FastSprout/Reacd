import { expect, expectTypeOf, it } from 'vitest';
import { colorPickerSchema, colorValueSchema } from './color-picker.schema.js';
import type { ColorPickerProps } from '../../components/color-picker/index.js';
it('uses canonical bounded rgb or rgba values and strictly closed properties', () => {
  const props = {
    mode: 'rgb',
    label: 'Color',
    value: '#abcdef',
    onValueChange: (_value: string) => undefined,
  };
  expect(colorPickerSchema.safeParse(props).success).toBe(true);
  expect(
    colorPickerSchema.safeParse({ ...props, mode: 'rgba', value: '#abcdef80' }).success,
  ).toBe(true);
  expect(colorValueSchema('rgb').safeParse('#abcdef').success).toBe(true);
  for (const value of ['#abc', '#ABCDEF', '#abcdef80', '#abcdef\n', 'red', '#gg0000'])
    expect(colorValueSchema('rgb').safeParse(value).success).toBe(false);
  for (const invalid of [
    { ...props, mode: undefined },
    { ...props, onValueChange: 'save' },
    { ...props, style: {} },
    { ...props, children: 'native' },
    { ...props, presets: [{ label: 'One', value: '#abcdef80' }] },
    {
      ...props,
      presets: [
        { label: 'One', value: '#abcdef' },
        { label: 'Other', value: '#abcdef' },
      ],
    },
  ])
    expect(colorPickerSchema.safeParse(invalid).success).toBe(false);
  expectTypeOf<ColorPickerProps>().not.toHaveProperty('className');
});
