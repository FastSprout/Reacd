import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import type { ToggleProps } from
  '@fastsprout/reacd/adapter-runtime/components/toggle/toggle.props.js';
import { useNativeField } from '../native-field.js';

export type MuiToggleProps = ToggleProps;

export function MuiToggle(props: MuiToggleProps) {
  const field = useNativeField(props);
  return (
    <FormControlLabel
      label={props.label}
      control={
        <Switch
          checked={props.checked}
          disabled={field.disabled}
          slotProps={{ input: { role: 'switch' } }}
          onChange={(_event, checked) => props.onCheckedChange(checked)}
        />
      }
    />
  );
}
