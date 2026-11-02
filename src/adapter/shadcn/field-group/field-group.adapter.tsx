import type { FieldGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/field-group/field-group.props.js';
import { FIELD_GROUP_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/field-group-policy.js';
import { Field, FieldGroup } from '../vendor/ui/field.js';

export type ShadcnFieldGroupProps = FieldGroupProps;

export function ShadcnFieldGroup({
  label,
  children,
  orientation = FIELD_GROUP_DEFAULTS.orientation,
}: ShadcnFieldGroupProps) {
  return (
    <FieldGroup role="group" aria-label={label} data-orientation={orientation}>
      <Field
        role="presentation"
        orientation={orientation === 'horizontal' ? 'responsive' : 'vertical'}
        className="min-w-0 flex-wrap [&>*]:min-w-0 [&>*]:flex-1"
      >
        {children}
      </Field>
    </FieldGroup>
  );
}
