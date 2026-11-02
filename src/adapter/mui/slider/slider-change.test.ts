import { expect, it, vi } from 'vitest';
import { emitSliderValue } from './slider-change.js';
it('isolates logical intervals and blocks incompatible SDK event payloads', () => {
  const scalar = vi.fn<(value: number) => void>();
  const range = vi.fn<(value: { start: number; end: number }) => void>();
  const single = {
    label: 'Volume',
    value: 20,
    min: 0,
    max: 100,
    onValueChange: scalar,
  };
  const multiple = {
    ...single,
    mode: 'range',
    value: { start: 20, end: 80 },
    onValueChange: range,
  } as const;
  emitSliderValue(single, 30, false);
  emitSliderValue(single, [30, 80], false);
  emitSliderValue(single, 40, true);
  emitSliderValue({ ...single, readOnly: true }, 40, false);
  expect(scalar.mock.calls).toEqual([[30]]);
  emitSliderValue(multiple, [30, 80], false);
  emitSliderValue(multiple, 30, false);
  emitSliderValue(multiple, [], false);
  emitSliderValue(multiple, [30], false);
  expect(range.mock.calls).toEqual([[{ start: 30, end: 80 }]]);
});
