import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import type { CheckboxProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox/checkbox.props.js';
import { useNativeField } from '../native-field.js';

export type MuiCheckboxProps = CheckboxProps;

export function MuiCheckbox(props: MuiCheckboxProps) {
  const id = useId();
  const field = useNativeField(props);
  const blocked = field.blocked || Boolean(props.readOnly);
  return (
    <FormControl
      inert={field.blocked}
      error={Boolean(field.error)}
      disabled={field.disabled}
    >
      <FormControlLabel
        sx={{ minHeight: LAYOUT_POLICY.controlTargetPx, margin: 0, maxWidth: '100%' }}
        label={props.label}
        control={
          <Checkbox
            checked={props.checked && !props.indeterminate}
            indeterminate={Boolean(props.indeterminate)}
            disabled={field.disabled}
            required={field.required}
            name={field.name}
            value={props.value}
            slotProps={{
              input: {
                'aria-describedby': [...field.descriptionIds, id].join(' '),
                'aria-invalid': Boolean(field.error),
                'aria-readonly': props.readOnly,
                'aria-checked': props.indeterminate ? 'mixed' : props.checked,
              },
            }}
            onChange={(_event, checked) => {
              emitNativeValue(props.onCheckedChange, checked, blocked);
            }}
          />
        }
      />
      <FormHelperText id={id}>{field.helperError || props.description}</FormHelperText>
    </FormControl>
  );
}
