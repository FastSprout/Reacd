import { COLOR_PICKER_POLICY as P } from '../../core/color-picker-policy.js';
export function colorPickerVariables() {
  return {
    '--reacd-color-area-height': `${P.areaHeightRem}rem`,
    '--reacd-color-track-height': `${P.trackHeightRem}rem`,
    '--reacd-color-thumb': `${P.thumbRem}rem`,
    '--reacd-color-thumb-outline': `${P.thumbOutlinePx}px`,
    '--reacd-color-thumb-shadow': `${P.thumbShadowPx}px`,
    '--reacd-color-thumb-light': P.thumbLight,
    '--reacd-color-thumb-dark': P.thumbDark,
  };
}
