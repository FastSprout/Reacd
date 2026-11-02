import { Button, Text, Theme, Toolbar, Tooltip, VStack } from '@fastsprout/reacd';
import { resolveDesignTemplate } from '../../design/preferences.js';
import { findThemePreset, THEME_PRESETS } from '../../design/presets.js';
import type { ThemePresetsProps } from './theme-presets.props.js';

export function ThemePresets({
  preferences, appearance, onChange,
}: ThemePresetsProps) {
  const selected = findThemePreset(preferences);
  return (
    <VStack spacing="small">
      <Toolbar label="Theme preset">
        {THEME_PRESETS.map(preset => (
          <Theme key={preset.key}
            template={resolveDesignTemplate(preset.preferences, appearance)}>
            <Tooltip text={`${preset.label} theme`}>
              <Button label={`${preset.label} theme`} iconOnly
                leadingIcon={preset.key === selected?.key ? 'check' : 'appearance'}
                pressed={preset.key === selected?.key}
                onPress={() => onChange(preset.preferences)} />
            </Tooltip>
          </Theme>
        ))}
      </Toolbar>
      <Text role="caption">{`${selected?.label ?? 'Custom'} theme`}</Text>
    </VStack>
  );
}
