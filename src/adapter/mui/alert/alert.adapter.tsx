import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { AlertProps } from
  '@fastsprout/reacd/adapter-runtime/components/alert/alert.props.js';
import { useNativeField } from '../native-field.js';
import { MuiIcon } from '../icon/icon.adapter.js';

export type MuiAlertProps = AlertProps;

export function MuiAlert(props: MuiAlertProps) {
  const field = useNativeField({});
  const changeOpen = field.blocked ? undefined : props.onOpenChange;
  if (props.open === false) return null;
  return (
    <Alert
      severity={props.intent}
      icon={props.icon && <MuiIcon name={props.icon} decorative />}
      closeText={props.closeLabel}
      {...(changeOpen ? { onClose: () => changeOpen(false) } : {})}
    >
      <AlertTitle>{props.title}</AlertTitle>
      {props.message}
      {props.actions && (
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
          {props.actions.map((action) => (
            <Button
              key={action.id}
              disabled={field.blocked || Boolean(action.disabled)}
              color={action.intent === 'danger' ? 'error' : 'inherit'}
              onClick={() => action.onPress()}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Alert>
  );
}
