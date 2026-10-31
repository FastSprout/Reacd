import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { parseColor } from 'react-aria-components/ColorPicker';
import { expect, it, vi } from 'vitest';
import { useColorModel } from './use-color-model.js';
it('retains achromatic hue locally without a redundant write', () => {
  const changed = vi.fn();
  const view = renderHook(
    ({ blocked }) => useColorModel('#808080', 'rgb', blocked, changed),
    {
      initialProps: { blocked: false },
    },
  );
  act(() => view.result.current.change(parseColor('hsb(230, 0%, 50.2%)')));
  expect(view.result.current.color.getChannelValue('hue')).toBe(230);
  expect(changed).not.toHaveBeenCalled();
  view.rerender({ blocked: true });
  act(() => view.result.current.change(parseColor('#ff0000')));
  expect(view.result.current.color.getChannelValue('hue')).toBe(230);
  expect(changed).not.toHaveBeenCalled();
});
