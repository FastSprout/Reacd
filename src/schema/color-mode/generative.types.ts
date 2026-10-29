import type { z } from 'zod';
import type {
  colorModeButtonNodeSchema,
} from '../color-mode-button/generative.schema.js';
import type {
  colorModeSwitchNodeSchema,
} from '../color-mode-switch/generative.schema.js';
import type {
  colorModeSelectNodeSchema,
} from '../color-mode-select/generative.schema.js';
import type {
  colorModeAvatarNodeSchema,
} from '../color-mode-avatar/generative.schema.js';
import type {
  colorModeImageNodeSchema,
} from '../color-mode-image/generative.schema.js';

export type ColorModeControlNode =
  | z.infer<typeof colorModeButtonNodeSchema>
  | z.infer<typeof colorModeSwitchNodeSchema>
  | z.infer<typeof colorModeSelectNodeSchema>;
export type ColorModeAssetNode =
  z.infer<typeof colorModeAvatarNodeSchema> | z.infer<typeof colorModeImageNodeSchema>;
export type ColorModeNode = ColorModeControlNode | ColorModeAssetNode;
