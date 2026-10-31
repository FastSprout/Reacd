import { useId } from 'react';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import type { RadioGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/radio-group/radio-group.js';
import { CHOICE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/choice-policy.js';
import { ChoiceHeader } from
  '@fastsprout/reacd/adapter-runtime/renderer/choice/choice-header.renderer.js';
import { ChoiceText } from
  '@fastsprout/reacd/adapter-runtime/renderer/choice/choice-text.renderer.js';

export function ShadcnRadioGroup({
  label,
  description,
  items,
  value,
  onValueChange,
  disabled,
  required,
  name,
  orientation = CHOICE_DEFAULTS.orientation,
}: RadioGroupProps) {
  const id = useId();
  return (
    <RadioGroup<string>
      render={<fieldset />}
      className="reacd-node reacd-choice-group"
      data-slot="radio-group"
      aria-labelledby={id}
      aria-describedby={description === undefined ? undefined : `${id}-description`}
      aria-orientation={orientation}
      name={name ?? id}
      value={value}
      disabled={disabled}
      required={required}
      onValueChange={(next) => onValueChange(next)}
    >
      <ChoiceHeader
        id={id}
        label={label}
        description={description}
        required={required}
      />
      <div className="reacd-choice-items" data-orientation={orientation}>
        {items.map((item) => {
          const itemId = `${id}-${item.value}`;
          return (
            <label key={item.value} className="reacd-choice-item">
              <Radio.Root<string>
                value={item.value}
                disabled={item.disabled}
                className="reacd-choice-control reacd-radio"
                data-slot="radio-group-item"
                aria-labelledby={itemId}
                aria-describedby={
                  item.description === undefined ? undefined : `${itemId}-description`
                }
              >
                <Radio.Indicator className="reacd-choice-indicator">
                  <span className="reacd-radio-dot" />
                </Radio.Indicator>
              </Radio.Root>
              <ChoiceText
                id={itemId}
                label={item.label}
                description={item.description}
              />
            </label>
          );
        })}
      </div>
    </RadioGroup>
  );
}
