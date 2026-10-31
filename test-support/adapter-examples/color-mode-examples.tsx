import {
  ColorModeAvatar,
  ColorModeButton,
  ColorModeImage,
  ColorModeSelect,
  ColorModeSwitch,
} from '../../src/components/index.js';

const control = {
  label: 'Color mode example',
  value: 'system',
  resolvedMode: 'light',
  onValueChange() {},
} as const;
const sources = { mode: 'light', light: '/light.svg', dark: '/dark.svg' } as const;

export const COLOR_MODE_EXAMPLES = {
  ColorModeButton: <ColorModeButton {...control} />,
  ColorModeSwitch: <ColorModeSwitch {...control} />,
  ColorModeSelect: <ColorModeSelect {...control} />,
  ColorModeAvatar: <ColorModeAvatar {...sources} name="Example account" />,
  ColorModeImage: <ColorModeImage {...sources} alt="Example illustration" />,
};
