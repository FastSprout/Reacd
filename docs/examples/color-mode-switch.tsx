import { ColorModeSwitch, Text, VStack } from '@fastsprout/reacd';
import { AppearancePreview } from './appearance-preview.js';

export function ColorModeSwitchExample() {
  return (
    <AppearancePreview>
      {({ value, resolvedMode, setValue }) => (
        <VStack>
          <ColorModeSwitch
            label="Dark appearance"
            value={value}
            resolvedMode={resolvedMode}
            onValueChange={setValue}
          />
          <Text>{`Resolved appearance: ${resolvedMode}`}</Text>
        </VStack>
      )}
    </AppearancePreview>
  );
}
