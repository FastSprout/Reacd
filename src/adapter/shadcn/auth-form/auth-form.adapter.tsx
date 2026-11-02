import type { AuthFormProps } from
  '@fastsprout/reacd/adapter-runtime/components/auth-form/auth-form.props.js';
import { AUTH_FORM_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/auth-form-policy.js';
import { ShadcnCard } from '../card/card.adapter.js';
import { ShadcnText } from '../text/text.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import { FieldDescription, FieldGroup, FieldSeparator } from '../vendor/ui/field.js';

export type ShadcnAuthFormProps = AuthFormProps;

export function ShadcnAuthForm({
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
}: ShadcnAuthFormProps) {
  const hasHeader = [leading, title, description, header].some(Boolean);
  return (
    <ShadcnCard
      header={
        hasHeader ? (
          <>
            {leading}
            {title && <ShadcnText role="headline">{title}</ShadcnText>}
            {description && <ShadcnText>{description}</ShadcnText>}
            {header}
          </>
        ) : undefined
      }
      footer={footer}
    >
      {loading && (
        <FieldDescription role="status" aria-live="polite">
          {loadingLabel}
        </FieldDescription>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <ShadcnForm
        announcePending={false}
        label={label}
        onSubmit={onSubmit}
        disabled={disabled || loading}
        submitting={loading}
      >
        <FieldGroup>
          {providers.map((provider) => (
            <ShadcnButton
              key={provider.key}
              label={provider.label}
              onPress={provider.onPress}
              intent={provider.intent}
              disabled={provider.disabled}
            />
          ))}
          {providers.length > 0 && separatorLabel && (
            <FieldSeparator>{separatorLabel}</FieldSeparator>
          )}
          {children}
          <ShadcnSubmitButton label={submitLabel} />
        </FieldGroup>
      </ShadcnForm>
    </ShadcnCard>
  );
}
