import {
  ColorModeImage,
  ColorModeSwitch,
  Viewport,
  Text,
  VStack,
} from '@fastsprout/reacd';
import { AppearancePreview } from './appearance-preview.js';

export function ColorModeImageExample() {
  return (
    <AppearancePreview>
      {({ value, resolvedMode, setValue }) => (
        <VStack>
          <ColorModeSwitch
            label="Dark illustration"
            value={value}
            resolvedMode={resolvedMode}
            onValueChange={setValue}
          />
          <Viewport compact>
            <ColorModeImage
              alt="Illustrated workspace preview"
              mode={resolvedMode}
              light="/color-mode-light.svg"
              dark="/color-mode-dark.svg"
            />
          </Viewport>
          <Text>{`Resolved appearance: ${resolvedMode}`}</Text>
        </VStack>
      )}
    </AppearancePreview>
  );
}
