import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { AuthFormProps } from
  '@fastsprout/reacd/adapter-runtime/components/auth-form/auth-form.props.js';
import { AUTH_FORM_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/auth-form-policy.js';
import { MuiCard } from '../card/card.adapter.js';
import { MuiText } from '../text/text.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiButton } from '../button/button.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { materialSpacing } from '../layout/spacing.js';

export type MuiAuthFormProps = AuthFormProps;

export function MuiAuthForm({
  label,
  title,
  description,
  leading,
  header,
  children,
  footer,
  submitLabel,
  onSubmit,
  separatorLabel,
  error,
  loading = AUTH_FORM_DEFAULTS.loading,
  disabled = AUTH_FORM_DEFAULTS.disabled,
  loadingLabel = AUTH_FORM_DEFAULTS.loadingLabel,
  providers = AUTH_FORM_DEFAULTS.providers,
}: AuthFormProps) {
  const theme = useTheme();
  const hasHeader = [leading, title, description, header].some(Boolean);
  return (
    <MuiCard
      header={
        hasHeader ? (
          <Stack spacing={materialSpacing(theme)}>
            {leading}
            {title && <MuiText role="headline">{title}</MuiText>}
            {description && <MuiText>{description}</MuiText>}
            {header}
          </Stack>
        ) : undefined
      }
      footer={footer}
    >
      {loading && (
        <Typography role="status" aria-live="polite">
          {loadingLabel}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <MuiForm
        announcePending={false}
        label={label}
        onSubmit={onSubmit}
        disabled={disabled || loading}
        submitting={loading}
      >
        {providers.map((provider) => (
          <MuiButton
            key={provider.key}
            label={provider.label}
            onPress={provider.onPress}
            intent={provider.intent}
            disabled={provider.disabled}
          />
        ))}
        {providers.length > 0 && separatorLabel && <Divider>{separatorLabel}</Divider>}
        {children}
        <MuiSubmitButton label={submitLabel} />
      </MuiForm>
    </MuiCard>
  );
}
