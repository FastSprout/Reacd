import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import type { CheckboxGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox-group/checkbox-group.props.js';
import { useNativeField } from '../native-field.js';

export type MuiCheckboxGroupProps = CheckboxGroupProps;

export function MuiCheckboxGroup(props: MuiCheckboxGroupProps) {
  const id = useId();
  const field = useNativeField(props);
  return (
    <FormControl
      inert={field.blocked}
      component="fieldset"
      disabled={field.disabled}
      required={field.required}
      error={Boolean(field.error)}
    >
      <FormLabel component="legend" id={`${id}-label`}>
        {props.label}
      </FormLabel>
      <FormGroup
        row={props.orientation === 'horizontal'}
        aria-labelledby={`${id}-label`}
        aria-describedby={[...field.descriptionIds, `${id}-help`].join(' ')}
      >
        {props.items.map((item) => {
          const checked = props.value.includes(item.value);
          const atLimit = props.max !== undefined && props.value.length >= props.max;
          return (
            <FormControlLabel
              key={item.value}
              label={item.label}
              disabled={
                field.disabled || Boolean(item.disabled) || (!checked && atLimit)
              }
              control={
                <Checkbox
                  checked={checked}
                  name={field.name}
                  value={item.value}
                  required={field.required && props.value.length === 0}
                  slotProps={{
                    input: {
                      'aria-description': item.description,
                      'aria-invalid': Boolean(field.error),
                      'aria-describedby': [...field.descriptionIds, `${id}-help`].join(
                        ' ',
                      ),
                    },
                  }}
                  onChange={(_event, selected) => {
                    const next = selected
                      ? [...props.value, item.value]
                      : props.value.filter((value) => value !== item.value);
                    emitNativeValue(props.onValueChange, next, field.blocked);
                  }}
                />
              }
            />
          );
        })}
      </FormGroup>
      <FormHelperText id={`${id}-help`}>
        {field.helperError || props.description}
      </FormHelperText>
    </FormControl>
  );
}
