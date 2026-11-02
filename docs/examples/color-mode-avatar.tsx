import {
  ColorModeAvatar,
  ColorModeSwitch,
  HStack,
  Text,
  VStack,
} from '@fastsprout/reacd';
import { AppearancePreview } from './appearance-preview.js';

export function ColorModeAvatarExample() {
  return (
    <AppearancePreview>
      {({ value, resolvedMode, setValue }) => (
        <VStack>
          <HStack>
            <ColorModeAvatar
              name="Reacd illustration avatar"
              mode={resolvedMode}
              light="/color-mode-light.svg"
              dark="/color-mode-dark.svg"
            />
            <Text>Alex Morgan · Product designer</Text>
          </HStack>
          <ColorModeSwitch
            label="Dark avatar"
            value={value}
            resolvedMode={resolvedMode}
            onValueChange={setValue}
          />
        </VStack>
      )}
    </AppearancePreview>
  );
}
