import { useId, useLayoutEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { ListBox, ListBoxItem, Text } from 'react-aria-components/ListBox';
import { I18nProvider } from 'react-aria-components/I18nProvider';
import { useDirection } from '@radix-ui/react-direction';
import type { ListboxProps } from
  '@fastsprout/reacd/adapter-runtime/components/listbox/index.js';
import {
  LISTBOX_DEFAULTS,
  LISTBOX_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/listbox-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Button } from '../vendor/ui/button.js';
import { ListboxFormBridge } from './form-bridge.js';
import { useListboxRequest } from './use-listbox-request.js';
import { focusListboxAfterClear } from './clear-focus.js';
import { maintainListboxSemantics } from './native-semantics.js';

export function ShadcnListbox(properties: ListboxProps) {
  const id = useId();
  const metadata = useFieldMetadata(
    properties,
    properties.description === undefined ? [] : [`${id}-description`],
  );
  const effectiveProperties: ListboxProps = {
    ...properties,
    name: metadata.name,
    required: metadata.required,
    disabled: metadata.disabled,
  };
  const {
    label,
    items,
    description,
    name,
    required,
    disabled,
    readOnly,
    mode = LISTBOX_DEFAULTS.mode,
    locale = LISTBOX_DEFAULTS.locale,
    status = LISTBOX_DEFAULTS.status,
    clearLabel = LISTBOX_DEFAULTS.clearLabel,
    emptyMessage = LISTBOX_DEFAULTS.emptyMessage,
    loadingMessage = LISTBOX_DEFAULTS.loadingMessage,
    errorMessage = LISTBOX_DEFAULTS.errorMessage,
  } = effectiveProperties;
  const direction = useDirection();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [invalid, setInvalid] = useState(false);
  const { values, blocked, failure, select, request, reset } =
    useListboxRequest(effectiveProperties);
  if (invalid && (values.length > 0 || !required || disabled)) setInvalid(false);
  useLayoutEffect(
    () =>
      maintainListboxSemantics(root, {
        readOnly: Boolean(readOnly) || status !== 'ready',
        required: Boolean(required),
        invalid: invalid || metadata.error.length > 0,
        disabled: Boolean(disabled),
        busy: status === 'loading',
      }),
    [root, readOnly, required, invalid, disabled, status, metadata.error],
  );
  const describedBy = [
    ...metadata.descriptionIds,
    `${id}-status`,
    `${id}-error`,
    failure === undefined ? undefined : `${id}-request-error`,
  ]
    .filter(Boolean)
    .join(' ');
  const variables: CSSProperties & { '--reacd-listbox-rows': number } = {
    '--reacd-listbox-rows': LISTBOX_POLICY.visibleRows,
  };
  return (
    <I18nProvider locale={locale}>
      <div
        className="reacd-node reacd-field reacd-listbox"
        dir={direction}
        onPointerDownCapture={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDownCapture={(event) => {
          if (disabled) {
            event.stopPropagation();
            if (event.key !== 'Tab') event.preventDefault();
            return;
          }
          if (
            event.nativeEvent.isComposing ||
            event.keyCode === LISTBOX_POLICY.imeProcessKeyCode
          ) {
            event.stopPropagation();
            if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
          }
        }}
      >
        <span>
          <span id={id}>{label}</span>
          {required ? ' (required)' : ''}
        </span>
        {description === undefined ? null : (
          <p id={`${id}-description`}>{description}</p>
        )}
        <ListBox
          ref={setRoot}
          items={items}
          className="reacd-listbox-options"
          style={variables}
          aria-labelledby={id}
          aria-describedby={describedBy}
          selectionMode={mode}
          selectionBehavior="toggle"
          escapeKeyBehavior="none"
          selectedKeys={new Set(values)}
          onSelectionChange={select}
          disabledKeys={items
            .filter((item) => disabled || item.disabled)
            .map((item) => item.value)}
        >
          {(item) => (
            <ListBoxItem
              id={item.value}
              textValue={item.label}
              className="reacd-listbox-option"
            >
              <Text slot="label">{item.label}</Text>
              {item.description === undefined ? null : (
                <Text slot="description" className="reacd-listbox-description">
                  {item.description}
                </Text>
              )}
            </ListBoxItem>
          )}
        </ListBox>
        <p id={`${id}-status`} role={status === 'error' ? 'alert' : 'status'}>
          {status === 'loading'
            ? loadingMessage
            : status === 'error'
              ? errorMessage
              : items.length === 0
                ? emptyMessage
                : LISTBOX_DEFAULTS.readyMessage}
        </p>
        {failure === undefined ? null : (
          <p id={`${id}-request-error`} role="alert">
            {failure}
          </p>
        )}
        <Button
          type="button"
          className="reacd-node reacd-button"
          disabled={blocked || values.length === 0}
          onClick={(event) => {
            const button = event.currentTarget;
            const wasFocused = button.ownerDocument.activeElement === button;
            if (request([])) focusListboxAfterClear(root, button, wasFocused);
          }}
        >
          {clearLabel}
        </Button>
        <ListboxFormBridge
          values={values}
          multiple={mode === 'multiple'}
          name={name}
          required={required}
          disabled={disabled}
          root={root}
          errorId={`${id}-error`}
          reset={reset}
          invalid={invalid}
          markInvalid={() => setInvalid(true)}
        />
      </div>
    </I18nProvider>
  );
}
