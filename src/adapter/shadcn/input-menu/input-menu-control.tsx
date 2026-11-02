import { useMemo, type Ref } from 'react';
import { Combobox as NativeCombobox } from '@base-ui/react/combobox';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useDirection } from '@radix-ui/react-direction';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { XIcon } from 'lucide-react';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/input-menu.props.js';
import type { SelectionOption } from
  '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';
import {
  FORM_MENU_DEFAULTS,
  FORM_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { filterFormMenuItems } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-search.js';
import { Button } from '../vendor/ui/base-button.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from '../vendor/ui/base-combobox.js';
import { Field, FieldLabel, FieldDescription, FieldError } from '../vendor/ui/field.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { activateSuggestion } from './input-menu-value.js';
import { useInputMenuValue } from './use-input-menu-value.js';

export interface InputMenuControlProps extends InputMenuProps {
  readonly id: string;
  readonly inputRef?: Ref<HTMLInputElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly onAccepted?: ((value: string) => void) | undefined;
  readonly managed?: boolean | undefined;
  readonly validationError?: string | undefined;
}

export function InputMenuControl({ inputRef, ...props }: InputMenuControlProps) {
  const field = useNativeField(props, props.description ? [`${props.id}-help`] : []);
  const blocked = Boolean(field.blocked || props.readOnly);
  const popup = useNativePopup(!field.disabled);
  const theme = useShadcnTheme();
  const direction = useDirection();
  const status = props.status ?? FORM_MENU_DEFAULTS.status;
  const value = useInputMenuValue(props, blocked, props.onAccepted);
  const collection = useMemo(
    () =>
      NativeCombobox.createItems(props.items, {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
      }),
    [props.items],
  );
  const visible =
    status === 'ready'
      ? filterFormMenuItems(props.items, props.value, props.visibleValues)
      : [];
  const describedBy =
    [
      ...field.descriptionIds,
      ...(props.validationError ? [`${props.id}-error`] : []),
      ...(value.error ? [`${props.id}-request`] : []),
    ].join(' ') || undefined;
  const open = !field.blocked && (props.open ?? popup.open);
  const clear = (props.clearable ?? FORM_MENU_DEFAULTS.clearable) &&
    props.value !== '' && (
      <NativeCombobox.Clear
        keepMounted
        tabIndex={FORM_MENU_POLICY.controlTabIndex}
        aria-label={`${FORM_MENU_DEFAULTS.clearLabel}: ${props.label}`}
        disabled={blocked}
        render={<Button variant="ghost" size="icon-xs" />}
        onClick={(event) => {
          if (!value.requestText('')) event.preventBaseUIHandler();
        }}
      >
        <XIcon aria-hidden />
      </NativeCombobox.Clear>
    );
  return (
    <DirectionProvider direction={direction}>
      <Combobox<string, false, SelectionOption>
        items={collection}
        value={null}
        inputValue={props.value}
        filteredItems={visible}
        openOnInputClick
        open={open}
        disabled={field.disabled}
        readOnly={blocked}
        locale={FORM_MENU_POLICY.locale}
        onOpenChange={(next, event) => {
          if (field.blocked || !value.request(props.onOpenChange, next)) event.cancel();
          else popup.onOpenChange(next);
        }}
        onInputValueChange={(next, event) => {
          if (event.reason !== 'input-change' || !value.requestText(next))
            event.cancel();
        }}
        onValueChange={(key, event) => {
          if (
            !activateSuggestion(props, key, blocked, value.request, value.requestText)
          )
            event.cancel();
        }}
      >
        <NativeCombobox.InputGroup
          render={
            <Field
              inert={field.blocked}
              dir={direction}
              className="min-w-0 max-w-full [overflow-wrap:anywhere]"
            />
          }
        >
          <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
          <ComboboxInput
            className="w-full min-w-0 max-w-full"
            id={props.id}
            ref={inputRef}
            name={field.name}
            showTrigger={false}
            disabled={field.disabled}
            placeholder={props.placeholder}
            aria-label={props.label}
            aria-busy={status === 'loading'}
            aria-required={field.required}
            required={!props.managed && field.required}
            aria-invalid={Boolean(field.error || props.validationError)}
            aria-describedby={describedBy}
            onBlur={props.onBlur}
          >
            {!open && clear}
          </ComboboxInput>
          <ComboboxContent
            render={<DismissableLayer />}
            className="min-w-0"
            container={popup.host ?? undefined}
            style={theme}
            dir={direction}
            sideOffset={FORM_MENU_POLICY.sideOffsetPx}
            finalFocus={popup.active ? undefined : false}
          >
            {open && clear}
            {status === 'ready' && (
              <ComboboxEmpty>
                {props.emptyMessage ?? FORM_MENU_DEFAULTS.emptyMessage}
              </ComboboxEmpty>
            )}
            <ComboboxList
              aria-label={`${props.label} ${FORM_MENU_DEFAULTS.suggestionsLabel}`}
            >
              {visible.map((item) => (
                <ComboboxItem
                  key={item.value}
                  value={item.value}
                  disabled={blocked || item.disabled}
                  className={
                    'min-w-0 flex-wrap whitespace-normal [overflow-wrap:anywhere]'
                  }
                >
                  {item.label}
                  {item.description && (
                    <FieldDescription>{item.description}</FieldDescription>
                  )}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
          <NativeCombobox.Status render={<FieldDescription />}>
            {status === 'ready'
              ? `${visible.length} ${FORM_MENU_DEFAULTS.availableMessage}`
              : status === 'loading'
                ? (props.loadingMessage ?? FORM_MENU_DEFAULTS.loadingMessage)
                : (props.errorMessage ?? FORM_MENU_DEFAULTS.errorMessage)}
          </NativeCombobox.Status>
          {props.description && (
            <FieldDescription id={`${props.id}-help`}>
              {props.description}
            </FieldDescription>
          )}
          {props.validationError && (
            <FieldError id={`${props.id}-error`}>{props.validationError}</FieldError>
          )}
          {value.error && (
            <FieldError id={`${props.id}-request`}>{value.error}</FieldError>
          )}
        </NativeCombobox.InputGroup>
      </Combobox>
    </DirectionProvider>
  );
}
