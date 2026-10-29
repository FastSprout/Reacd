import { useContext, useId, useRef, useState } from 'react';
import { Select } from '@base-ui/react/select';
import { ChevronDownIcon } from 'lucide-react';
import type { SelectProps } from '../../../components/select/index.js';
import { SELECT_POLICY } from '../../../core/select-policy.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { useFieldMetadata } from '../../../renderer/form-field/field-metadata.js';
import { Label } from '../vendor/ui/label.js';
import { Button } from '../vendor/ui/button.js';
import { ShadcnBaseSelectContent } from './select-base-content.adapter.js';
import { SelectOption } from './select-option.js';
import { selectDisplayText } from './display-text.js';
import { useSelectChange } from './use-select-change.js';

export function ShadcnSelect(properties: SelectProps) {
  const id = useId();
  const control = useRef<HTMLButtonElement>(null);
  const active = useContext(PortalActiveContext);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(
    properties,
    properties.description ? [`${id}-description`] : [],
  );
  const multiple = properties.mode === 'multiple';
  const values = properties.mode === 'multiple' ? properties.value : [properties.value];
  const empty =
    properties.mode === 'multiple'
      ? properties.value.length === 0
      : properties.value === SELECTION_POLICY.emptySingleValue;
  const localError =
    attempted && metadata.required && empty
      ? multiple
        ? SELECT_POLICY.multipleRequiredMessage
        : SELECT_POLICY.singleRequiredMessage
      : '';
  const feedback = metadata.error || localError;
  const described = [
    ...metadata.descriptionIds,
    ...(localError && !metadata.error ? [`${id}-error`] : []),
  ];
  const change = useSelectChange(properties, metadata.disabled, active);
  const protectedValue = metadata.disabled || properties.readOnly || properties.loading;
  return (
    <div className="reacd-node reacd-field reacd-select">
      <Label htmlFor={id}>{properties.label}</Label>
      {properties.description && (
        <p id={`${id}-description`}>{properties.description}</p>
      )}
      <div className="reacd-select-entry">
        <Select.Root<string, boolean>
          key={active ? 'active' : 'inactive'}
          multiple={multiple}
          items={properties.items}
          disabled={metadata.disabled}
          readOnly={properties.readOnly || properties.loading || !active}
          value={
            properties.mode === 'multiple'
              ? properties.value
              : empty
                ? null
                : properties.value
          }
          onValueChange={(next) => change(next)}
        >
          <Select.Trigger
            ref={control}
            id={id}
            type="button"
            className="reacd-select-trigger"
            aria-required={metadata.required || undefined}
            aria-invalid={Boolean(feedback) || undefined}
            aria-busy={properties.loading || undefined}
            aria-describedby={described.join(' ') || undefined}
          >
            <Select.Value
              className="reacd-select-value"
              style={{ WebkitLineClamp: SELECT_POLICY.triggerLineLimit }}
            >
              {selectDisplayText(properties)}
            </Select.Value>
            <ChevronDownIcon aria-hidden="true" className="reacd-select-icon" />
          </Select.Trigger>
          <ShadcnBaseSelectContent
            label={properties.label}
            empty={properties.items.length === 0 && !properties.loading}
          >
            {properties.items.map((item, index) => (
              <SelectOption
                key={item.value}
                option={item}
                descriptionId={`${id}-option-${index}`}
              />
            ))}
          </ShadcnBaseSelectContent>
        </Select.Root>
        {properties.clearable && (
          <Button
            type="button"
            variant="outline"
            className="reacd-button"
            disabled={protectedValue || empty}
            onClick={() => change(multiple ? [] : SELECTION_POLICY.emptySingleValue)}
          >
            {SELECT_POLICY.clearPrefix} {properties.label}
          </Button>
        )}
      </div>
      {properties.loading && <p role="status">{SELECT_POLICY.loadingMessage}</p>}
      {localError && !metadata.error && (
        <p id={`${id}-error`} role="alert" className="reacd-field-error">
          {localError}
        </p>
      )}
      {values.map((value) => (
        <input
          key={value}
          type="hidden"
          name={metadata.name}
          value={value}
          disabled={metadata.disabled}
        />
      ))}
      <input
        type="text"
        hidden
        defaultValue=""
        required={metadata.required && empty}
        disabled={metadata.disabled}
        onInvalid={(event) => {
          event.preventDefault();
          setAttempted(true);
          control.current?.focus();
        }}
      />
    </div>
  );
}
