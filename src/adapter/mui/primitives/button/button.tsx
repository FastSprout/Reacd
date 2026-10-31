import MaterialButton from '@mui/material/Button';
import type { ButtonPrimitiveProps } from
  '../../../shared/primitives/button/button.props.js';
import {
  MUI_BUTTON_SIZES,
  MUI_BUTTON_VARIANTS,
  MUI_PRIMITIVE_DEFAULTS,
} from '../appearance.js';
import { MUI_BUTTON_STYLE, MUI_ICON_BUTTON_STYLE } from '../styles.js';

export function MuiButtonPrimitive({
  variant,
  size,
  color: _color,
  ...properties
}: ButtonPrimitiveProps) {
  const appearance =
    MUI_BUTTON_VARIANTS[variant ?? MUI_PRIMITIVE_DEFAULTS.buttonVariant];
  const scale = MUI_BUTTON_SIZES[size ?? MUI_PRIMITIVE_DEFAULTS.buttonSize];
  return (
    <MaterialButton
      {...properties}
      {...appearance}
      {...(scale === undefined ? {} : { size: scale })}
      sx={
        size === 'icon'
          ? { ...MUI_BUTTON_STYLE, ...MUI_ICON_BUTTON_STYLE }
          : MUI_BUTTON_STYLE
      }
    />
  );
}
