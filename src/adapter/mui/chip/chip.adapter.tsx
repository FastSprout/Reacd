import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import type { ChipProps } from
  '@fastsprout/reacd/adapter-runtime/components/chip/chip.props.js';
import {
  CHIP_DEFAULTS,
  CHIP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chip-policy.js';

export type MuiChipProps = ChipProps;
const colors = { primary: 'primary', secondary: 'default', danger: 'error' } as const;

export function MuiChip({
  label,
  text,
  children,
  size = CHIP_DEFAULTS.size,
  intent = CHIP_DEFAULTS.intent,
  corner = CHIP_DEFAULTS.corner,
  inset = CHIP_DEFAULTS.inset,
  standalone = CHIP_DEFAULTS.standalone,
  show = CHIP_DEFAULTS.show,
}: ChipProps) {
  const name = text === undefined ? label : `${label}: ${text}`;
  const indicator = show && (
    <Chip
      role="img"
      aria-label={name}
      title={name}
      label={text ?? ''}
      color={colors[intent]}
      size={size === 'large' ? 'medium' : 'small'}
      sx={{
        fontSize: `${CHIP_POLICY.textScale[size]}em`,
        maxInlineSize: `${CHIP_POLICY.maxInlineRem}rem`,
        ...(text === undefined
          ? {
              inlineSize: `${CHIP_POLICY.dotRem[size]}rem`,
              blockSize: `${CHIP_POLICY.dotRem[size]}rem`,
              '& .MuiChip-label': { padding: 0 },
            }
          : {}),
      }}
    />
  );
  if (standalone) return indicator;
  return (
    <Stack
      sx={{
        minWidth: 0,
        maxWidth: '100%',
        gap: inset ? 0 : `${CHIP_POLICY.clearanceRem}rem`,
        flexDirection: corner.startsWith('bottom') ? 'column-reverse' : 'column',
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: corner.endsWith('start') ? 'start' : 'end' }}
      >
        {indicator}
      </Stack>
      {children}
    </Stack>
  );
}
