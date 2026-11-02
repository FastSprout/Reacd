import type { BannerProps } from
  '@fastsprout/reacd/adapter-runtime/components/banner/banner.props.js';
import { BANNER_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/banner-policy.js';
import { Alert, AlertDescription, AlertTitle } from '../vendor/ui/alert.js';
import { Button } from '../vendor/ui/button.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';

export type ShadcnBannerProps = BannerProps;
export function ShadcnBanner({
  title,
  description,
  open,
  onOpenChange,
  actions,
  intent = BANNER_DEFAULTS.intent,
  dismissible = BANNER_DEFAULTS.dismissible,
  closeLabel = BANNER_DEFAULTS.closeLabel,
}: BannerProps) {
  if (!open) return null;
  return (
    <Alert
      variant={intent === 'error' ? 'destructive' : 'default'}
      role={intent === 'warning' || intent === 'error' ? 'alert' : 'status'}
      aria-label={title}
    >
      <ShadcnIcon name={intent} decorative />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      {actions}
      {dismissible && (
        <Button type="button" variant="outline" className={WRAPPING_BUTTON_CLASSES}
          onClick={() => onOpenChange(false)}>
          {closeLabel}
        </Button>
      )}
    </Alert>
  );
}
