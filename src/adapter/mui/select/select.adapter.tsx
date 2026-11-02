import { focusMaterialField } from '../native-focus.js';
import type { MaterialFocusHandle } from '../native-focus.js';
import { useId, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { SELECT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/select-policy.js';
import Select from '@mui/material/Select';
import type { SelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/select/select.props.js';
import { emitSelectValue } from './select-change.js';
import { useNativeField } from '../native-field.js';

export type MuiSelectProps = SelectProps;

export function MuiSelect(props: MuiSelectProps) {
  const id = useId();
  const focusHandle = useRef<MaterialFocusHandle>(null);
  const [open, setOpen] = useState(false);
  const field = useNativeField(props);
  const disabled = field.disabled;
  if (field.blocked && open) setOpen(false);
  const blocked = field.blocked || props.loading || props.readOnly;
  if (props.mode === 'multiple' && field.name !== undefined) {
    throw new UnsupportedAdapterComponentError('material-ui', 'Select');
  }
  return (
    <FormControl
      inert={field.blocked}
      fullWidth
      disabled={disabled}
      required={field.required}
      error={Boolean(field.error)}
    >
      <InputLabel id={`${id}-label`}>{props.label}</InputLabel>
      <Select<string | string[]>
        inputRef={focusHandle}
        labelId={`${id}-label`}
        label={props.label}
        value={props.mode === 'multiple' ? [...props.value] : props.value}
        multiple={props.mode === 'multiple'}
        name={field.name}
        displayEmpty
        renderValue={(value) => {
          const values = typeof value === 'string' ? [value] : value;
          return values.length > SELECT_POLICY.maximumDisplayedLabels
            ? `${values.length} ${SELECT_POLICY.selectedSuffix}`
            : values
                .map((key) => props.items.find((item) => item.value === key)?.label)
                .join(SELECT_POLICY.labelSeparator) ||
                props.placeholder ||
                SELECT_POLICY.placeholder;
        }}
        SelectDisplayProps={{
          'aria-busy': props.loading,
          'aria-readonly': Boolean(blocked),
        }}
        readOnly={field.blocked}
        open={open && !field.blocked}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        MenuProps={{ disableRestoreFocus: field.blocked }}
        inputProps={{
          onInvalid: (event: SyntheticEvent<HTMLInputElement>) => {
            event.preventDefault();
            focusMaterialField(focusHandle.current);
          },
          'aria-describedby': [...field.descriptionIds, `${id}-help`].join(' '),
          'aria-invalid': Boolean(field.error),
        }}
        onChange={(event) =>
          emitSelectValue(props, event.target.value, Boolean(blocked))
        }
      >
        {props.placeholder && (
          <MenuItem value="" disabled>
            {props.placeholder}
          </MenuItem>
        )}
        {props.items.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            disabled={Boolean(item.disabled)}
            sx={{ whiteSpace: 'normal' }}
          >
            <Stack>
              <Typography>{item.label}</Typography>
              {item.description && (
                <Typography color="text.secondary">{item.description}</Typography>
              )}
            </Stack>
          </MenuItem>
        ))}
      </Select>
      {props.loading && <CircularProgress aria-label={SELECT_POLICY.loadingMessage} />}
      <FormHelperText id={`${id}-help`}>
        {field.helperError || props.description}
      </FormHelperText>
      {props.clearable && (
        <Button
          disabled={Boolean(blocked)}
          onClick={() => {
            if (props.mode === 'multiple') props.onValueChange([]);
            else props.onValueChange('');
          }}
        >
          Clear {props.label}
        </Button>
      )}
    </FormControl>
  );
}
