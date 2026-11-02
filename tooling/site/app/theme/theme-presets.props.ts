import type { DesignPreferences } from '../../design/preferences.js';

export interface ThemePresetsProps {
  readonly preferences: DesignPreferences;
  readonly appearance: 'light' | 'dark';
  readonly onChange: (preferences: DesignPreferences) => void;
}
