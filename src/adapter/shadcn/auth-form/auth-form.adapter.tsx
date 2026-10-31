import { useContext, useId } from 'react';
import type { AuthFormProps } from
  '@fastsprout/reacd/adapter-runtime/components/auth-form/auth-form.props.js';
import { AUTH_FORM_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/auth-form-policy.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { PageHeading } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-heading.js';
import {
  FieldMetadataContext,
  useFieldMetadata,
} from '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { FormSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form.renderer.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

export function ShadcnAuthForm({
  label,
  submitLabel,
  onSubmit,
  title,
  description,
  leading,
  header,
  children,
  footer,
  error,
  separatorLabel,
  providers = AUTH_FORM_DEFAULTS.providers,
  loading = AUTH_FORM_DEFAULTS.loading,
  disabled = AUTH_FORM_DEFAULTS.disabled,
  loadingLabel = AUTH_FORM_DEFAULTS.loadingLabel,
}: AuthFormProps) {
  const level = useContext(HeadingLevelContext);
  const id = useId();
  const descendantLevel = title === undefined ? level : nextHeadingLevel(level);
  const metadata = useFieldMetadata({ disabled: disabled || loading });
  const blocked = metadata.disabled;
  return (
    <section
      className="reacd-node reacd-auth-form"
      aria-labelledby={title === undefined ? undefined : id}
    >
      <HeadingLevelContext.Provider value={descendantLevel}>
        {leading}
        {header}
      </HeadingLevelContext.Provider>
      <PageHeading title={title} id={id} />
      {description !== undefined && <p>{description}</p>}
      <HeadingLevelContext.Provider value={descendantLevel}>
        <FormSurface
          label={label}
          onSubmit={() => {
            if (!blocked) onSubmit();
          }}
        >
          <FieldMetadataContext value={metadata}>
            <fieldset
              className="reacd-auth-fields"
              disabled={blocked}
              aria-busy={loading}
            >
              <legend className="sr-only">{label}</legend>
              {providers.map((provider) => (
                <ShadcnButton
                  key={provider.key}
                  label={provider.label}
                  intent={provider.intent}
                  disabled={blocked || provider.disabled}
                  onPress={() => provider.onPress()}
                />
              ))}
              {separatorLabel !== undefined && <p>{separatorLabel}</p>}
              {children}
              {error !== undefined && <p role="alert">{error}</p>}
              <ShadcnSubmitButton label={submitLabel} disabled={blocked} />
            </fieldset>
          </FieldMetadataContext>
          {loading && <p role="status">{loadingLabel}</p>}
        </FormSurface>
        {footer}
      </HeadingLevelContext.Provider>
    </section>
  );
}
