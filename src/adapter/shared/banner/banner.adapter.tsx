import { useId } from 'react';
import type { BannerProps } from
  '@fastsprout/reacd/adapter-runtime/components/banner/banner.js';
import { BANNER_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/banner-policy.js';
import { Alert, AlertTitle, AlertDescription } from '../primitives/alert.js';
import { Button } from '../primitives/button.js';

export function SharedBanner({
  title,
  description,
  open,
  onOpenChange,
  dismissible = BANNER_DEFAULTS.dismissible,
  closeLabel = BANNER_DEFAULTS.closeLabel,
  intent = BANNER_DEFAULTS.intent,
  actions,
}: BannerProps) {
  const identity = useId();
  if (!open) return null;
  const urgent = intent === 'warning' || intent === 'error';
  return (
    <Alert
      className="reacd-node reacd-banner"
      data-slot="banner"
      data-intent={intent}
      variant={intent === 'error' ? 'destructive' : 'default'}
      role={urgent ? 'alert' : 'status'}
      aria-labelledby={identity}
    >
      <div className="reacd-banner-content">
        <AlertTitle id={identity}>{title}</AlertTitle>
        {description !== undefined && (
          <AlertDescription>{description}</AlertDescription>
        )}
      </div>
      {actions !== undefined && <div className="reacd-banner-actions">{actions}</div>}
      {dismissible && (
        <Button
          className="reacd-button reacd-banner-close"
          variant="outline"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          {closeLabel}
        </Button>
      )}
    </Alert>
  );
}
