import { atom } from 'jotai';
import { COLOR_MODE_POLICY } from '../../core/color-mode-policy.js';
import type { ColorMode } from '../../core/color-mode-policy.js';

export const colorModeAtom = atom<ColorMode>(COLOR_MODE_POLICY.initialPreference);
