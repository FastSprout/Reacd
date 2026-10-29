import { useContext, useId } from 'react';
import type { FormProps } from '../../components/form/form.js';
import { FORM_SUBMIT_POLICY } from '../../core/form-submit-policy.js';
import { TrustedFormBoundary } from './form-boundary.js';
import {
  FieldMetadataContext,
  useFieldMetadata,
} from '../form-field/field-metadata.js';
import { PortalActiveContext } from '../theme/portal-context.js';

export function FormSurface({
  children,
  label,
  onSubmit,
  disabled,
  submitting,
  errors,
}: FormProps) {
  const summaryId = useId();
  const active = useContext(PortalActiveContext);
  const metadata = useFieldMetadata({ disabled });
  const blocked = metadata.disabled || submitting;
  const hasErrors = errors !== undefined && errors.length > 0;
  return (
    <TrustedFormBoundary>
      {submitting && (
        <p role="status">
          {FORM_SUBMIT_POLICY.submittingPrefix} {label}
        </p>
      )}
      <form
        className="reacd-node reacd-vstack reacd-form"
        aria-label={label}
        aria-busy={submitting || undefined}
        aria-describedby={hasErrors ? summaryId : undefined}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (active && !blocked) onSubmit();
        }}
      >
        {hasErrors && (
          <div
            id={summaryId}
            role="alert"
            aria-labelledby={`${summaryId}-label`}
            className="reacd-form-summary"
          >
            <p id={`${summaryId}-label`}>{FORM_SUBMIT_POLICY.summaryLabel}</p>
            <ul>
              {errors.map((issue, index) => (
                <li key={index}>
                  {issue.label && <>{issue.label}: </>}
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <fieldset
          className="reacd-form-fields reacd-vstack"
          aria-label={label}
          disabled={metadata.disabled}
          inert={blocked || undefined}
        >
          <FieldMetadataContext value={metadata}>
            <PortalActiveContext value={active && !blocked}>
              {children}
            </PortalActiveContext>
          </FieldMetadataContext>
        </fieldset>
      </form>
    </TrustedFormBoundary>
  );
}
