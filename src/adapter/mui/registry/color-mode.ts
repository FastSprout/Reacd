import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { colorModeButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-button/index.js';
import { MuiColorModeButton } from '../color-mode-button/color-mode-button.adapter.js';
import { colorModeSwitchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-switch/index.js';
import { MuiColorModeSwitch } from '../color-mode-switch/color-mode-switch.adapter.js';
import { colorModeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-select/index.js';
import { MuiColorModeSelect } from '../color-mode-select/color-mode-select.adapter.js';
import { colorModeAvatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-avatar/index.js';
import { MuiColorModeAvatar } from '../color-mode-avatar/color-mode-avatar.adapter.js';
import { colorModeImageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-image/index.js';
import { MuiColorModeImage } from '../color-mode-image/color-mode-image.adapter.js';

export const colorModeEntries = {
  ColorModeButton: renderEntry(
    'ColorModeButton',
    colorModeButtonSchema,
    MuiColorModeButton,
  ),
  ColorModeSwitch: renderEntry(
    'ColorModeSwitch',
    colorModeSwitchSchema,
    MuiColorModeSwitch,
  ),
  ColorModeSelect: renderEntry(
    'ColorModeSelect',
    colorModeSelectSchema,
    MuiColorModeSelect,
  ),
  ColorModeAvatar: renderEntry(
    'ColorModeAvatar',
    colorModeAvatarSchema,
    MuiColorModeAvatar,
  ),
  ColorModeImage: renderEntry(
    'ColorModeImage',
    colorModeImageSchema,
    MuiColorModeImage,
  ),
};
