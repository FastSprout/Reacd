import { useId, useRef } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/index.js';
import {
  FORM_MENU_DEFAULTS,
  FORM_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { SELECT_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/select-menu-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Button } from '../vendor/ui/button.js';
import { useSelectMenu } from './use-select-menu.js';
import { SelectMenuRoot } from './select-menu-root.js';
import { SelectMenuPopup } from './select-menu-popup.js';
import { SelectMenuForm } from './select-menu-form.js';

export function ShadcnSelectMenu(supplied: SelectMenuProps) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const field = useFieldMetadata(supplied, supplied.description ? [`${id}-help`] : []);
  const properties = {
    ...supplied,
    name: field.name,
    required: field.required,
    disabled: field.disabled,
  };
  const model = useSelectMenu(properties);
  const error = field.error ? undefined : model.error;
  const described = [
    `${id}-status`,
    `${id}-selection`,
    ...field.descriptionIds,
    ...(error === undefined ? [] : [`${id}-error`]),
  ];
  const labels = model.selected.flatMap((value) =>
    properties.items.filter((item) => item.value === value).map((item) => item.label),
  );
  const message =
    model.status === 'loading'
      ? (properties.loadingMessage ?? SELECT_MENU_DEFAULTS.loadingMessage)
      : model.status === 'error'
        ? (properties.errorMessage ?? SELECT_MENU_DEFAULTS.errorMessage)
        : model.items.length === 0
          ? (properties.emptyMessage ?? SELECT_MENU_DEFAULTS.emptyMessage)
          : `${model.items.length} ${SELECT_MENU_DEFAULTS.availableMessage}`;
  return (
    <div className="reacd-node reacd-field reacd-select-menu">
      <label id={`${id}-label`} htmlFor={id}>
        {properties.label}
      </label>
      <SelectMenuRoot properties={properties} model={model}>
        <div className="reacd-select-menu-controls">
          <Combobox.Trigger
            id={id}
            ref={trigger}
            render={
              <Button
                type="button"
                variant="outline"
                className="reacd-node reacd-input"
              />
            }
            className="reacd-select-menu-trigger"
            aria-labelledby={`${id}-label`}
            aria-describedby={described.join(' ')}
            aria-required={properties.required}
            aria-readonly={properties.readOnly}
            aria-invalid={Boolean(field.error) || error !== undefined}
            onKeyDownCapture={(event) => {
              if (
                event.nativeEvent.isComposing ||
                event.nativeEvent.keyCode === FORM_MENU_POLICY.compositionProcessCode
              ) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }
              if (
                event.key.length === 1 &&
                event.key !== ' ' &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
              ) {
                event.preventDefault();
                event.stopPropagation();
                model.requestQuery(model.query + event.key);
                model.requestOpen(true);
              }
            }}
          >
            <span id={`${id}-selection`}>
              {labels.length === 0
                ? (properties.placeholder ?? SELECT_MENU_DEFAULTS.placeholder)
                : labels.join(SELECT_MENU_DEFAULTS.labelSeparator)}
            </span>
          </Combobox.Trigger>
          {(properties.clearable ?? FORM_MENU_DEFAULTS.clearable) &&
            model.selected.length !== 0 && (
              <Combobox.Clear
                keepMounted
                tabIndex={0}
                render={<Button type="button" className="reacd-node reacd-button" />}
                disabled={model.disabled || properties.readOnly}
                aria-label={`${SELECT_MENU_DEFAULTS.clearLabel}: ${properties.label}`}
                onClick={(event) => {
                  event.preventBaseUIHandler();
                  if (model.requestSelection([])) trigger.current?.focus();
                }}
              >
                {SELECT_MENU_DEFAULTS.clearLabel}
              </Combobox.Clear>
            )}
        </div>
        <SelectMenuPopup properties={properties} model={model} trigger={trigger} />
      </SelectMenuRoot>
      {properties.description !== undefined && (
        <span id={`${id}-help`}>{properties.description}</span>
      )}
      <span
        id={`${id}-status`}
        role={model.status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {message}
      </span>
      {error !== undefined && (
        <span id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
      <SelectMenuForm
        properties={properties}
        trigger={trigger}
        invalid={model.invalidRequired}
      />
    </div>
  );
}
