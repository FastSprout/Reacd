import type { SelectProps } from '../../../components/select/index.js';
import { SELECT_POLICY } from '../../../core/select-policy.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';

export function selectDisplayText(properties: SelectProps): string {
  const values =
    properties.mode === 'multiple'
      ? properties.value
      : properties.value === SELECTION_POLICY.emptySingleValue
        ? []
        : [properties.value];
  if (values.length === 0) return properties.placeholder ?? SELECT_POLICY.placeholder;
  if (values.length > SELECT_POLICY.maximumDisplayedLabels) {
    return `${values.length} ${SELECT_POLICY.selectedSuffix}`;
  }
  return properties.items
    .filter((item) => values.includes(item.value))
    .map((item) => item.label)
    .join(SELECT_POLICY.labelSeparator);
}
