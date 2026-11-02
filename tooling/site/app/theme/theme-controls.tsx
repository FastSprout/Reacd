import { Button, Select, VStack } from '@fastsprout/reacd';
import {
  DEFAULT_DESIGN_PREFERENCES, parseDesignPreferences,
} from '../../design/preferences.js';
import { findThemePreset, THEME_PRESETS } from '../../design/presets.js';
import type { ThemeControlsProps } from './theme-controls.props.js';
import { THEME_FIELDS } from './options.js';
import { selectThemePreset } from './preset-selection.js';

export function ThemeControls({ preferences, onChange }: ThemeControlsProps) {
  const selected = findThemePreset(preferences);
  return (
    <VStack>
      <Select label="Theme preset" value={selected?.key ?? 'custom'}
        items={[
          ...THEME_PRESETS.map(preset => ({
            value: preset.key, label: preset.label,
          })),
          { value: 'custom', label: 'Custom', disabled: true },
        ]}
        onValueChange={key => selectThemePreset(key, onChange)} />
      {THEME_FIELDS.map(field => (
        <Select key={field.key} label={field.label}
          value={preferences[field.key]} items={field.items}
          onValueChange={value => onChange(parseDesignPreferences({
            ...preferences, [field.key]: value,
          }))} />
      ))}
      <Button label="Reset theme" intent="secondary"
        onPress={() => onChange(DEFAULT_DESIGN_PREFERENCES)} />
    </VStack>
  );
}
