import Chip from '@mui/material/Chip';
import type { BadgePrimitiveProps } from
  '../../../shared/primitives/badge/badge.props.js';
import { MUI_BADGE_APPEARANCE, MUI_PRIMITIVE_DEFAULTS } from '../appearance.js';

export function MuiBadgePrimitive({
  children,
  variant,
  color: _color,
  ...properties
}: BadgePrimitiveProps) {
  const appearance =
    MUI_BADGE_APPEARANCE[variant ?? MUI_PRIMITIVE_DEFAULTS.badgeVariant];
  return <Chip component="div" {...properties} {...appearance} label={children} />;
}
