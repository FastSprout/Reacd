import type { AlertProps } from
  '@fastsprout/reacd/adapter-runtime/components/alert/alert.js';
import { Alert, AlertDescription } from '../primitives/alert.js';
import { Button } from '../primitives/button.js';
import { SharedIcon } from '../icon/icon.adapter.js';
import { ELEMENT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';
import { ELEMENT_BUTTON_VARIANTS } from '../element/variants.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';

export function SharedAlert({
  title,
  message,
  intent,
  open,
  onOpenChange,
  closeLabel,
  icon,
  actions,
}: AlertProps) {
  if (open === false) return null;
  const urgent = intent === 'error' || intent === 'warning';
  return (
    <Alert
      className="reacd-node reacd-alert"
      data-intent={intent}
      role={urgent ? 'alert' : 'status'}
      variant={intent === 'error' ? 'destructive' : 'default'}
    >
      <div className="reacd-alert-layout">
        <div className="reacd-alert-content">
          <div className="reacd-alert-heading">
            <SharedIcon name={icon ?? intent} decorative />
            <strong>{title}</strong>
          </div>
          <AlertDescription>{message}</AlertDescription>
          {actions === undefined || actions.length === 0 ? null : (
            <div className="reacd-alert-actions">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  className="reacd-button"
                  onClick={() => action.onPress()}
                  disabled={action.disabled}
                  variant={
                    ELEMENT_BUTTON_VARIANTS[action.intent ?? DEFAULTS.buttonIntent]
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {onOpenChange === undefined ? null : (
          <Button
            type="button"
            variant="ghost"
            className="reacd-alert-close"
            aria-label={closeLabel ?? `${ELEMENT_POLICY.dismissPrefix} ${title}`}
            onClick={() => onOpenChange(false)}
          >
            <SharedIcon name="close" decorative />
          </Button>
        )}
      </div>
    </Alert>
  );
}
