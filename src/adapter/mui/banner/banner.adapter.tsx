import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { BannerProps } from
  '@fastsprout/reacd/adapter-runtime/components/banner/banner.props.js';
import { BANNER_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/banner-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiBannerProps = BannerProps;

export function MuiBanner({
  title,
  description,
  open,
  onOpenChange,
  actions,
  intent = BANNER_DEFAULTS.intent,
  dismissible = BANNER_DEFAULTS.dismissible,
  closeLabel = BANNER_DEFAULTS.closeLabel,
}: BannerProps) {
  const field = useNativeField({});
  if (!open) return null;
  return (
    <Alert
      severity={intent}
      aria-label={title}
      role={intent === 'warning' || intent === 'error' ? 'alert' : 'status'}
      action={
        dismissible ? (
          <Button
            type="button"
            color="inherit"
            disabled={field.blocked}
            onClick={() => onOpenChange(false)}
          >
            {closeLabel}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {description}
      {actions && <Stack>{actions}</Stack>}
    </Alert>
  );
}
