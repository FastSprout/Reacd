import type { ComponentProps } from 'react';
import Box from '@mui/material/Box';
import { SLIDER_POLICY } from '@fastsprout/reacd/adapter-runtime/core/slider-policy.js';

interface RangeInputProps extends ComponentProps<'input'> {
  readonly 'data-index': number;
  readonly ownerState?: unknown;
}

export function MuiSliderRangeInput({
  name,
  'data-index': index,
  ownerState: _ownerState,
  ...input
}: RangeInputProps) {
  const suffix = index === 0 ? SLIDER_POLICY.startSuffix : SLIDER_POLICY.endSuffix;
  return (
    <Box
      component="input"
      {...input}
      data-index={index}
      name={name === undefined ? undefined : `${name}${suffix}`}
    />
  );
}
