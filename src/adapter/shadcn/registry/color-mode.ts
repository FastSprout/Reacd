import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { colorModeButtonSchema } from '../../../schema/color-mode-button/index.js';
import {
  ShadcnColorModeButton,
} from '../color-mode-button/color-mode-button.adapter.js';
import { colorModeSwitchSchema } from '../../../schema/color-mode-switch/index.js';
import {
  ShadcnColorModeSwitch,
} from '../color-mode-switch/color-mode-switch.adapter.js';
import { colorModeSelectSchema } from '../../../schema/color-mode-select/index.js';
import {
  ShadcnColorModeSelect,
} from '../color-mode-select/color-mode-select.adapter.js';
import { colorModeAvatarSchema } from '../../../schema/color-mode-avatar/index.js';
import {
  ShadcnColorModeAvatar,
} from '../color-mode-avatar/color-mode-avatar.adapter.js';
import { colorModeImageSchema } from '../../../schema/color-mode-image/index.js';
import { ShadcnColorModeImage } from '../color-mode-image/color-mode-image.adapter.js';

export const colorModeEntries = {
  ColorModeButton: renderEntry(
    'ColorModeButton',
    colorModeButtonSchema,
    ShadcnColorModeButton,
  ),
  ColorModeSwitch: renderEntry(
    'ColorModeSwitch',
    colorModeSwitchSchema,
    ShadcnColorModeSwitch,
  ),
  ColorModeSelect: renderEntry(
    'ColorModeSelect',
    colorModeSelectSchema,
    ShadcnColorModeSelect,
  ),
  ColorModeAvatar: renderEntry(
    'ColorModeAvatar',
    colorModeAvatarSchema,
    ShadcnColorModeAvatar,
  ),
  ColorModeImage: renderEntry(
    'ColorModeImage',
    colorModeImageSchema,
    ShadcnColorModeImage,
  ),
};
