import Button from '@mui/material/Button';
import type { SubmitButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/submit-button/submit-button.props.js';
import { useNativeField } from '../native-field.js';

export type MuiSubmitButtonProps = SubmitButtonProps;

export function MuiSubmitButton(props: MuiSubmitButtonProps) {
  const field = useNativeField(props);
  return (
    <Button
      type="submit"
      disabled={field.blocked}
      variant={props.intent === 'secondary' ? 'outlined' : 'contained'}
      color={props.intent === 'danger' ? 'error' : 'primary'}
    >
      {props.label}
    </Button>
  );
}
