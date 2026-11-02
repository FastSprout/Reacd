import { ColorModeButton, Text, VStack } from '@fastsprout/reacd';
import { AppearancePreview } from './appearance-preview.js';

export function ColorModeButtonExample() {
  return (
    <AppearancePreview>
      {({ value, resolvedMode, setValue }) => (
        <VStack>
          <ColorModeButton
            label="Toggle appearance"
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
