import { useId } from 'react';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';
import type { CheckboxGroupProps } from '../../../components/checkbox-group/index.js';
import { CHOICE_DEFAULTS } from '../../../core/choice-policy.js';
import { ChoiceHeader } from '../../../renderer/choice/choice-header.renderer.js';
import { ChoiceText } from '../../../renderer/choice/choice-text.renderer.js';

export function ShadcnCheckboxGroup({
  label,
  description,
  items,
  value,
  onValueChange,
  disabled,
  required,
  name,
  max,
  orientation = CHOICE_DEFAULTS.orientation,
}: CheckboxGroupProps) {
  const id = useId();
  const firstEnabled = items.findIndex((item) => !item.disabled);
  const described = description !== undefined || max !== undefined;
  return (
    <CheckboxGroup
      render={<fieldset />}
      className="reacd-node reacd-choice-group"
      data-slot="checkbox-group"
      aria-labelledby={id}
      aria-describedby={described ? `${id}-description` : undefined}
      value={[...value]}
      disabled={disabled}
      onValueChange={(next) => onValueChange(next)}
    >
      <ChoiceHeader
        id={id}
        label={label}
        description={description}
        required={required}
        max={max}
      />
      <div className="reacd-choice-items" data-orientation={orientation}>
        {items.map((item, index) => {
          const itemId = `${id}-${item.value}`;
          const limited =
            max !== undefined && value.length >= max && !value.includes(item.value);
          return (
            <label key={item.value} className="reacd-choice-item">
              <Checkbox.Root
                value={item.value}
                name={name ?? id}
                disabled={item.disabled}
                required={required && value.length === 0 && index === firstEnabled}
                readOnly={limited}
                aria-disabled={limited || undefined}
                className="reacd-choice-control reacd-choice-checkbox"
                data-slot="checkbox"
                aria-labelledby={itemId}
                aria-describedby={
                  item.description === undefined ? undefined : `${itemId}-description`
                }
              >
                <Checkbox.Indicator className="reacd-choice-indicator">
                  <CheckIcon className="reacd-choice-check" aria-hidden="true" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <ChoiceText
                id={itemId}
                label={item.label}
                description={item.description}
              />
            </label>
          );
        })}
      </div>
    </CheckboxGroup>
  );
}
