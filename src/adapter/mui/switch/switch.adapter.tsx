import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { emitNativeValue } from '../native-value.js';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { SWITCH_POLICY } from '@fastsprout/reacd/adapter-runtime/core/switch-policy.js';
import { useId } from 'react';
import type { SwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/switch/switch.props.js';
import { useNativeField } from '../native-field.js';

export type MuiSwitchProps = SwitchProps;

export function MuiSwitch(props: MuiSwitchProps) {
  const id = useId();
  const field = useNativeField(props);
  const disabled = field.disabled;
  const blocked = field.blocked || Boolean(props.loading) || Boolean(props.readOnly);
  return (
    <FormControl inert={field.blocked} error={Boolean(field.error)} disabled={disabled}>
      <FormControlLabel
        label={props.label}
        sx={{ minHeight: LAYOUT_POLICY.controlTargetPx, margin: 0, maxWidth: '100%' }}
        control={
          <Switch
            checked={props.checked}
            disabled={disabled}
            name={field.name}
            value={props.value}
            required={field.required}
            slotProps={{
              input: {
                role: 'switch',
                'aria-describedby': [...field.descriptionIds, id].join(' '),
                'aria-invalid': Boolean(field.error),
                'aria-readonly': props.readOnly,
                'aria-busy': props.loading,
              },
            }}
            onChange={(_event, checked) => {
              emitNativeValue(props.onCheckedChange, checked, blocked);
            }}
          />
        }
      />
      {props.loading && (
        <CircularProgress
          aria-label={`${SWITCH_POLICY.loadingPrefix} ${props.label}`}
        />
      )}
      <FormHelperText id={id}>{field.helperError || props.description}</FormHelperText>
    </FormControl>
  );
}
