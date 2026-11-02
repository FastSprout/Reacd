import { createRegistrationScope } from './registration-scope.js';
import { RegistrationContext } from './registration-context.js';
import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { ShadcnFormProps } from './form.props.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import {
  FieldMetadataContext,
  useFieldMetadata,
} from '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Form } from '../vendor/ui/form.js';
import {
  FormPendingContext,
  useInteractionState,
} from '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { FieldSet, FieldGroup, FieldDescription } from '../vendor/ui/field.js';
import { FORM_SUBMIT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/form-submit-policy.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';

export function ShadcnFormContent({
  children,
  label,
  onSubmit,
  disabled,
  submitting,
  errors,
  announcePending,
}: ShadcnFormProps) {
  const id = useId();
  const metadata = useFieldMetadata({ disabled });
  const { active, pending: parentPending } = useInteractionState();
  const pending = parentPending || Boolean(submitting);
  const blocked = !active || metadata.disabled || pending;
  const form = useForm<Record<string, unknown>>();
  const scope = useMemo(
    () => createRegistrationScope(form.unregister),
    [form.unregister],
  );
  return (
    <RegistrationContext value={scope}>
      <Form {...form}>
        <FieldGroup>
          {pending && announcePending !== false && (
            <FieldDescription role="status">
              {`${FORM_SUBMIT_POLICY.submittingPrefix} ${label}`}
            </FieldDescription>
          )}
          <form
            aria-label={label}
            aria-busy={pending}
            onSubmit={(event) => {
              event.stopPropagation();
              scope.prepare();
              void form.handleSubmit(() => {
                if (!blocked) onSubmit();
              })(event);
            }}
          >
            {errors && errors.length > 0 && (
              <Alert variant="destructive" id={id}>
                <AlertDescription>
                  {errors.map((issue, index) => (
                    <p key={index}>
                      {issue.label && `${issue.label}: `}
                      {issue.message}
                    </p>
                  ))}
                </AlertDescription>
              </Alert>
            )}
            <FieldSet
              className="grid min-w-0 grid-cols-1 gap-4"
              disabled={metadata.disabled}
              inert={blocked}
              aria-describedby={errors && errors.length > 0 ? id : undefined}
            >
              <FormPendingContext value={pending}>
                <PortalActiveContext.Provider value={active && !metadata.disabled}>
                  <FormScopeContext.Provider value={true}>
                    <FieldMetadataContext.Provider value={metadata}>
                      {children}
                    </FieldMetadataContext.Provider>
                  </FormScopeContext.Provider>
                </PortalActiveContext.Provider>
              </FormPendingContext>
            </FieldSet>
          </form>
        </FieldGroup>
      </Form>
    </RegistrationContext>
  );
}
