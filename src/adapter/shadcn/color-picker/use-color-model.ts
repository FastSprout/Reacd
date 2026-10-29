import { useState } from 'react';
import { parseColor } from 'react-aria-components/ColorPicker';
import type { Color } from 'react-aria-components/ColorPicker';
import type { ColorMode } from '../../../schema/color-picker/index.js';
export function useColorModel(
  value: string,
  mode: ColorMode,
  blocked: boolean,
  onValueChange: (value: string) => void,
) {
  const [local, setLocal] = useState(() => ({
    source: value,
    color: parseColor(value).toFormat('hsb'),
  }));
  const color =
    local.source === value ? local.color : parseColor(value).toFormat('hsb');
  function change(next: Color): void {
    if (blocked) return;
    const canonical = next.toString(mode === 'rgb' ? 'hex' : 'hexa').toLowerCase();
    setLocal({ source: canonical, color: next.toFormat('hsb') });
    if (canonical !== value) onValueChange(canonical);
  }
  return { color, change };
}
