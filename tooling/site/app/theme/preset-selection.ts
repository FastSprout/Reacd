import type { DesignPreferences } from '../../design/preferences.js';
import { THEME_PRESETS } from '../../design/presets.js';

export function selectThemePreset(
  key: string,
  onChange: (preferences: DesignPreferences) => void,
) {
  const preset = THEME_PRESETS.find(entry => entry.key === key);
  if (preset) onChange(preset.preferences);
}
