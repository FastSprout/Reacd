import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { ButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/button/button.props.js';
import { MuiIcon } from '../icon/icon.adapter.js';
import { useNativeField } from '../native-field.js';

export type MuiButtonProps = ButtonProps;

export function MuiButton(props: MuiButtonProps) {
  const field = useNativeField(props);
  if (props.iconOnly)
    return (
      <IconButton
        aria-pressed={props.pressed}
        aria-label={props.loading ? (props.loadingLabel ?? props.label) : props.label}
        color={props.intent === 'danger' ? 'error' : 'primary'}
        disabled={field.blocked}
        loading={Boolean(props.loading)}
        onClick={() => props.onPress()}
      >
        {props.leadingIcon && <MuiIcon name={props.leadingIcon} decorative />}
        {props.trailingIcon && <MuiIcon name={props.trailingIcon} decorative />}
      </IconButton>
    );
  return (
    <Button
      aria-pressed={props.pressed}
      variant={props.intent === 'secondary' ? 'outlined' : 'contained'}
      color={props.intent === 'danger' ? 'error' : 'primary'}
      disabled={field.blocked}
      loading={Boolean(props.loading)}
      startIcon={props.leadingIcon && <MuiIcon name={props.leadingIcon} decorative />}
      endIcon={props.trailingIcon && <MuiIcon name={props.trailingIcon} decorative />}
      onClick={() => props.onPress()}
    >
      {props.loading ? (props.loadingLabel ?? props.label) : props.label}
    </Button>
  );
}
