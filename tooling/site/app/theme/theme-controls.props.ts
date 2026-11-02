import type { DesignPreferences } from '../../design/preferences.js';

export interface ThemeControlsProps {
  readonly preferences: DesignPreferences;
  readonly onChange: (preferences: DesignPreferences) => void;
}
