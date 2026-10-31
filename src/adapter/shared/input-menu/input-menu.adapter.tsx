import { useId, useRef } from 'react';
import { Autocomplete } from '@base-ui/react/autocomplete';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/index.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { CONTENT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import {
  FORM_MENU_DEFAULTS,
  FORM_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { Input } from '../primitives/input.js';
import { Button } from '../primitives/button.js';
import { useInputMenu } from './use-input-menu.js';
import { InputMenuPopup } from './input-menu-popup.js';
import { InputMenuForm } from './input-menu-form.js';

export function SharedInputMenu(declared: InputMenuProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const metadata = useFieldMetadata(
    declared,
    declared.description ? [`${id}-help`] : [],
  );
  const properties = {
    ...declared,
    name: metadata.name,
    required: metadata.required,
    disabled: metadata.disabled,
  };
  const model = useInputMenu(properties);
  const { label, value, readOnly, description, placeholder } = properties;
  const localError = model.error && !metadata.error ? model.error : undefined;
  const described = [
    ...metadata.descriptionIds,
    `${id}-status`,
    ...(localError === undefined ? [] : [`${id}-error`]),
  ];
  const message =
    model.status === 'loading'
      ? (properties.loadingMessage ?? FORM_MENU_DEFAULTS.loadingMessage)
      : model.status === 'error'
        ? (properties.errorMessage ?? FORM_MENU_DEFAULTS.errorMessage)
        : model.items.length === 0
          ? (properties.emptyMessage ?? FORM_MENU_DEFAULTS.emptyMessage)
          : `${model.items.length} ${FORM_MENU_DEFAULTS.availableMessage}`;
  return (
    <div className="reacd-node reacd-field reacd-input-menu">
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <Autocomplete.Root
        items={model.items}
        value={value}
        open={model.open}
        mode="none"
        filter={null}
        locale={FORM_MENU_POLICY.locale}
        openOnInputClick
        disabled={model.disabled}
        readOnly={readOnly}
        itemToStringValue={(item) => item.label}
        onItemHighlighted={model.highlight}
        onValueChange={(next, details) => {
          if (details.reason === 'escape-key') {
            details.cancel();
            return;
          }
          const key =
            details.reason === 'item-press'
              ? model.highlighted.current?.value
              : undefined;
          if (!model.requestText(next, key)) details.cancel();
        }}
        onOpenChange={(next, details) => {
          if (
            (details.reason === 'item-press' && model.denied.current) ||
            !model.requestOpen(next)
          )
            details.cancel();
        }}
      >
        <Autocomplete.InputGroup className="reacd-input-menu-controls">
          <Autocomplete.Input
            id={id}
            ref={input}
            render={<Input />}
            className="reacd-node reacd-input"
            placeholder={placeholder}
            maxLength={CONTENT_POLICY.maxTextLength}
            aria-labelledby={`${id}-label`}
            aria-describedby={described.join(' ')}
            aria-required={properties.required}
            aria-invalid={Boolean(metadata.error || model.error)}
            onCompositionStart={() => {
              model.setComposing(true);
            }}
            onCompositionEnd={() => {
              model.setComposing(false);
            }}
            onKeyDownCapture={(event) => {
              const native = event.nativeEvent;
              const enter =
                event.key === 'Enter' ||
                native.keyCode === FORM_MENU_POLICY.compositionEnterCode;
              if (
                (enter && (native.isComposing || model.composing.current)) ||
                native.keyCode === FORM_MENU_POLICY.compositionProcessCode
              ) {
                event.preventDefault();
                event.stopPropagation();
              } else if (event.key === 'Escape' && model.open) {
                event.preventDefault();
                event.stopPropagation();
                model.requestOpen(false);
              }
            }}
          />
          {(properties.clearable ?? FORM_MENU_DEFAULTS.clearable) && value !== '' && (
            <Autocomplete.Clear
              render={<Button type="button" className="reacd-node reacd-button" />}
              tabIndex={0}
              disabled={model.disabled || readOnly}
              aria-label={`${FORM_MENU_DEFAULTS.clearLabel}: ${label}`}
              onMouseDown={(event) => event.preventBaseUIHandler()}
              onClick={(event) => {
                event.preventBaseUIHandler();
                if (model.requestText('')) input.current?.focus();
              }}
            >
              {FORM_MENU_DEFAULTS.clearLabel}
            </Autocomplete.Clear>
          )}
          <Autocomplete.Trigger
            aria-label={`${FORM_MENU_DEFAULTS.openLabel}: ${label}`}
            render={<Button type="button" className="reacd-node reacd-button" />}
          >
            {FORM_MENU_DEFAULTS.openLabel}
          </Autocomplete.Trigger>
        </Autocomplete.InputGroup>
        <InputMenuPopup
          label={label}
          items={model.items}
          open={model.open}
          inactive={model.status !== 'ready'}
          highlight={model.highlight}
        />
      </Autocomplete.Root>
      {description !== undefined && <span id={`${id}-help`}>{description}</span>}
      <span
        id={`${id}-status`}
        role={model.status === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {message}
      </span>
      {localError !== undefined && (
        <span id={`${id}-error`} role="alert">
          {localError}
        </span>
      )}
      <InputMenuForm
        properties={properties}
        input={input}
        invalid={model.invalidRequired}
      />
    </div>
  );
}
