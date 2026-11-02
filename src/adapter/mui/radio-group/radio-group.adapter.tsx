import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import type { RadioGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/radio-group/radio-group.props.js';
import { useNativeField } from '../native-field.js';

export type MuiRadioGroupProps = RadioGroupProps;

export function MuiRadioGroup(props: MuiRadioGroupProps) {
  const id = useId();
  const field = useNativeField(props);
  return (
    <FormControl
      inert={field.blocked}
      component="fieldset"
      required={field.required}
      disabled={field.disabled}
      error={Boolean(field.error)}
    >
      <FormLabel component="legend" id={`${id}-label`}>
        {props.label}
      </FormLabel>
      <RadioGroup
        aria-labelledby={`${id}-label`}
        aria-describedby={[...field.descriptionIds, `${id}-help`].join(' ')}
        name={field.name}
        value={props.value}
        row={props.orientation === 'horizontal'}
        onChange={(_event, value) =>
          emitNativeValue(props.onValueChange, value, field.blocked)
        }
      >
        {props.items.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            label={item.label}
            disabled={field.disabled || Boolean(item.disabled)}
            control={
              <Radio
                required={field.required}
                slotProps={{
                  input: {
                    'aria-description': item.description,
                    'aria-invalid': Boolean(field.error),
                    'aria-describedby': [...field.descriptionIds, `${id}-help`].join(
                      ' ',
                    ),
                  },
                }}
              />
            }
          />
        ))}
      </RadioGroup>
      <FormHelperText id={`${id}-help`}>
        {field.helperError || props.description}
      </FormHelperText>
    </FormControl>
  );
}
