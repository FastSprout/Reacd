import type { AlertProps } from
  '@fastsprout/reacd/adapter-runtime/components/alert/alert.props.js';
import { ELEMENT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';
import { Alert, AlertDescription, AlertTitle } from '../vendor/ui/alert.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';

export type ShadcnAlertProps = AlertProps;
export function ShadcnAlert({
  title,
  message,
  intent,
  icon,
  open = true,
  onOpenChange,
  closeLabel,
  actions,
}: AlertProps) {
  if (!open) return null;
  return (
    <Alert
      role={intent === 'info' || intent === 'success' ? 'status' : 'alert'}
      variant={intent === 'error' ? 'destructive' : 'default'}
    >
      <ShadcnIcon name={icon ?? intent} decorative />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {actions?.map((action) => (
        <ShadcnButton
          key={action.id}
          label={action.label}
          onPress={action.onPress}
          intent={action.intent}
          disabled={action.disabled}
        />
      ))}
      {onOpenChange && (
        <ShadcnButton
          label={closeLabel ?? `${ELEMENT_POLICY.dismissPrefix} ${title}`}
          intent="secondary"
          onPress={() => onOpenChange(false)}
        />
      )}
    </Alert>
  );
}
