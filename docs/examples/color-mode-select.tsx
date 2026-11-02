import { ColorModeSelect, Text, VStack } from '@fastsprout/reacd';
import { AppearancePreview } from './appearance-preview.js';

export function ColorModeSelectExample() {
  return (
    <AppearancePreview>
      {({ value, resolvedMode, setValue }) => (
        <VStack>
          <ColorModeSelect
            label="Color preference"
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
