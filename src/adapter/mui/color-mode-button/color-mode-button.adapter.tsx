import { useId } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import type { ColorModeButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-button/index.js';
import { oppositeColorMode } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode.js';
import { useNativeField } from '../native-field.js';
import { emitNativeValue } from '../native-value.js';

export type MuiColorModeButtonProps = ColorModeButtonProps;

export function MuiColorModeButton(props: MuiColorModeButtonProps) {
  const id = useId();
  const field = useNativeField(props);
  const blocked = field.blocked || Boolean(props.readOnly);
  return (
    <Stack>
      <ToggleButton
        value={props.resolvedMode}
        selected={props.resolvedMode === 'dark'}
        disabled={field.blocked}
        aria-describedby={id}
        onChange={() =>
          emitNativeValue(
            props.onValueChange,
            oppositeColorMode(props.resolvedMode),
            blocked,
          )
        }
      >
        {props.label}
      </ToggleButton>
      <FormHelperText id={id}>{props.description}</FormHelperText>
    </Stack>
  );
}
