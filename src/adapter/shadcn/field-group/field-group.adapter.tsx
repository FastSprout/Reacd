import type { FieldGroupProps } from '../../../components/field-group/index.js';
import { FIELD_GROUP_DEFAULTS } from '../../../core/field-group-policy.js';

export function ShadcnFieldGroup({
  label,
  orientation = FIELD_GROUP_DEFAULTS.orientation,
  children,
}: FieldGroupProps) {
  return (
    <div
      className="reacd-node reacd-field-group"
      role="group"
      aria-label={label}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}
