import type { DesignPreferences } from '../../design/preferences.js';

export interface ThemeCustomizerProps {
  readonly preferences: DesignPreferences;
  readonly onChange: (preferences: DesignPreferences) => void;
}
