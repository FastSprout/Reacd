import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { CheckboxGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox-group/checkbox-group.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Checkbox } from '../vendor/ui/checkbox.js';
import { Label } from '../vendor/ui/label.js';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '../vendor/ui/field.js';

export type ShadcnCheckboxGroupProps = CheckboxGroupProps;
export function ShadcnCheckboxGroup({
  label,
  value,
  onValueChange,
  items,
  description,
  orientation,
  max,
  ...properties
}: CheckboxGroupProps) {
  const id = useId();
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="grid gap-2"
      aria-describedby={metadata.descriptionIds.join(' ') || undefined}
    >
      <Label id={`${id}-label`}>{label}</Label>
      <div
        className={orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'grid gap-2'}
      >
        {items.map((item) => {
          const checked = value.includes(item.value);
          const limited = max !== undefined && value.length >= max && !checked;
          return (
            <Field key={item.value} orientation="horizontal" className="min-w-0 w-auto">
              <Checkbox
                id={`${id}-${item.value}`}
                checked={checked}
                name={metadata.name}
                value={item.value}
                required={metadata.required && value.length === 0}
                disabled={metadata.disabled || item.disabled || limited}
                aria-describedby={
                  item.description ? `${id}-${item.value}-help` : undefined
                }
                onCheckedChange={(next) => {
                  requestNativeChange(metadata.blocked, () =>
                    onValueChange(
                      next === true
                        ? [...value, item.value]
                        : value.filter((key) => key !== item.value),
                    ),
                  );
                }}
              />
              <FieldContent className="min-w-0">
                <FieldLabel
                  htmlFor={`${id}-${item.value}`}
                  className="min-w-0 max-w-full items-center [overflow-wrap:anywhere]"
                  style={{
                    minBlockSize: LAYOUT_POLICY.controlTargetPx,
                    minInlineSize: LAYOUT_POLICY.controlTargetPx,
                  }}
                >
                  {item.label}
                </FieldLabel>
                {item.description && (
                  <FieldDescription id={`${id}-${item.value}-help`}>
                    {item.description}
                  </FieldDescription>
                )}
              </FieldContent>
            </Field>
          );
        })}
      </div>
      {description && <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
