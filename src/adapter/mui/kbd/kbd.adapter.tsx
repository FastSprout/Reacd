import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import type { KbdProps } from
  '@fastsprout/reacd/adapter-runtime/components/kbd/kbd.props.js';
import {
  KBD_DEFAULTS,
  KBD_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/kbd-policy.js';
import { keyboardKey } from '@fastsprout/reacd/adapter-runtime/core/keyboard-key.js';

export type MuiKbdProps = KbdProps;
const colors = { primary: 'primary', secondary: 'default', danger: 'error' } as const;

export function MuiKbd({
  value,
  label,
  platform = KBD_DEFAULTS.platform,
  size = KBD_DEFAULTS.size,
  variant = KBD_DEFAULTS.variant,
  intent = KBD_DEFAULTS.intent,
}: KbdProps) {
  const key = keyboardKey(value, platform);
  return (
    <Chip
      component="kbd"
      role="img"
      label={key.display}
      aria-label={label ?? key.label}
      size={size === 'large' ? 'medium' : 'small'}
      color={colors[intent]}
      variant={variant === 'outline' ? 'outlined' : 'filled'}
      sx={(theme) => {
        const tone =
          intent === 'secondary'
            ? theme.palette.text.primary
            : theme.palette[colors[intent]].main;
        return {
          height: 'auto',
          maxWidth: '100%',
          fontSize: `${KBD_POLICY.textScale[size]}em`,
          ...(variant === 'soft'
            ? {
                backgroundColor: alpha(tone, theme.palette.action.selectedOpacity),
                color: tone,
              }
            : {}),
          ...(variant === 'subtle'
            ? { backgroundColor: 'transparent', color: tone }
            : {}),
          '& .MuiChip-label': { whiteSpace: 'normal', overflowWrap: 'anywhere' },
        };
      }}
    />
  );
}
