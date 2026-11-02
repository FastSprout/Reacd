import { expect, it, vi } from 'vitest';
import { THEME_PRESETS } from '../../design/presets.js';
import { selectThemePreset } from './preset-selection.js';

it('applies complete presets and ignores unknown or disabled custom choices', () => {
  const onChange = vi.fn();
  for (const preset of THEME_PRESETS) {
    selectThemePreset(preset.key, onChange);
    expect(onChange).toHaveBeenLastCalledWith(preset.preferences);
  }
  onChange.mockClear();
  selectThemePreset('custom', onChange);
  selectThemePreset('unknown', onChange);
  expect(onChange).not.toHaveBeenCalled();
});
