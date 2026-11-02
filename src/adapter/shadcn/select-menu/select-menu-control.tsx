import { useMemo, useRef, useState, type RefCallback } from 'react';
import { Combobox as NativeCombobox } from '@base-ui/react/combobox';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { useDirection } from '@radix-ui/react-direction';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/select-menu.props.js';
import type { SelectionOption } from
  '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';
import { SELECT_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/select-menu-policy.js';
import {
  FORM_MENU_DEFAULTS,
  FORM_MENU_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { filterFormMenuItems } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-search.js';
import { menuTextSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-menu-shared/text.schema.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { Button } from '../vendor/ui/base-button.js';
import { InputGroupText } from '../vendor/ui/base-input-group.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../vendor/ui/field.js';
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '../vendor/ui/base-combobox.js';
import { useMenuRequest } from './use-menu-request.js';
import { requestSelectMenuValue } from './select-menu-value.js';

export type SelectMenuControlProps = SelectMenuProps & {
  readonly id: string;
  readonly inputRef?: RefCallback<HTMLButtonElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly validationError?: string | undefined;
  readonly managed?: boolean | undefined;
  readonly onAccepted?: ((value: string | readonly string[]) => void) | undefined;
};

export function SelectMenuControl({ inputRef, ...props }: SelectMenuControlProps) {
  const field = useNativeField(props, props.description ? [`${props.id}-help`] : []);
  const popup = useNativePopup(!field.disabled);
  const [localQuery, setQuery] = useState('');
  const query = props.query ?? localQuery;
  const direction = useDirection();
  const theme = useShadcnTheme();
  const { error, request } = useMenuRequest();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const status = props.status ?? FORM_MENU_DEFAULTS.status;
  const blocked = field.blocked || props.readOnly || status !== 'ready';
  const keys = props.mode === 'multiple' ? props.value : [props.value];
  const selected = keys
    .flatMap((key) => {
      const item = props.items.find((entry) => entry.value === key);
      return item ? [item.label] : [];
    })
    .join(SELECT_MENU_DEFAULTS.labelSeparator);
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
      ? filterFormMenuItems(props.items, query, props.visibleValues)
      : [];
  const descriptions =
    [
      ...field.descriptionIds,
      ...(props.validationError ? [`${props.id}-error`] : []),
      ...(error ? [`${props.id}-request`] : []),
    ].join(' ') || undefined;
  function accept(next: string | readonly string[] | null): boolean {
    return requestSelectMenuValue(
      props,
      next,
      Boolean(blocked),
      request,
      props.onAccepted,
    );
  }
  return (
    <DirectionProvider direction={direction}>
      <Field inert={field.blocked}>
        <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
        <Combobox<string, boolean, SelectionOption>
          items={collection}
          value={props.mode === 'multiple' ? [...props.value] : props.value || null}
          multiple={props.mode === 'multiple'}
          inputValue={query}
          filteredItems={visible}
          open={!field.blocked && (props.open ?? popup.open)}
          name={field.name}
          disabled={field.disabled}
          required={!props.managed && field.required}
          onOpenChange={(next, event) => {
            if (field.blocked || !request(props.onOpenChange, next)) event.cancel();
            else popup.onOpenChange(next);
          }}
          onInputValueChange={(next, event) => {
            if (
              event.reason !== 'input-change' ||
              props.queryReadOnly ||
              !menuTextSchema.safeParse(next).success ||
              !request(props.onQueryChange, next)
            )
              event.cancel();
            else setQuery(next);
          }}
          onValueChange={(next, event) => {
            if (!accept(next)) event.cancel();
          }}
        >
          <ComboboxTrigger
            id={props.id}
            ref={(node) => {
              triggerRef.current = node;
              inputRef?.(node);
            }}
            onBlur={props.onBlur}
            aria-label={props.label}
            aria-required={field.required}
            aria-busy={status === 'loading'}
            aria-readonly={props.readOnly}
            aria-invalid={Boolean(field.error || props.validationError)}
            aria-describedby={descriptions}
            render={
              <Button
                variant="outline"
                className="h-auto min-h-8 w-full whitespace-normal"
              />
            }
          >
            <InputGroupText
              className="min-w-0 flex-1 whitespace-normal [overflow-wrap:anywhere]">
              <ComboboxValue>
                {selected || props.placeholder || SELECT_MENU_DEFAULTS.placeholder}
              </ComboboxValue>
            </InputGroupText>
          </ComboboxTrigger>
          <ComboboxContent
            render={<DismissableLayer />}
            dir={direction}
            container={popup.host ?? undefined}
            style={theme}
            finalFocus={popup.active ? undefined : false}
            sideOffset={FORM_MENU_POLICY.sideOffsetPx}
          >
            <ComboboxInput
              aria-label={`${SELECT_MENU_DEFAULTS.searchPrefix} ${props.label}`}
              showTrigger={false}
              readOnly={props.queryReadOnly || field.blocked}
            />
            {status === 'ready' && (
              <ComboboxEmpty>
                {props.emptyMessage ?? SELECT_MENU_DEFAULTS.emptyMessage}
              </ComboboxEmpty>
            )}
            <ComboboxList aria-label={props.label}>
              {visible.map((item) => (
                <ComboboxItem
                  key={item.value}
                  value={item.value}
                  disabled={
                    blocked || Boolean(item.disabled && !keys.includes(item.value))
                  }
                  className="whitespace-normal [overflow-wrap:anywhere]"
                >
                  {item.label}
                  {item.description && (
                    <FieldDescription>{item.description}</FieldDescription>
                  )}
                </ComboboxItem>
              ))}
            </ComboboxList>
            {status !== 'ready' && (
              <FieldDescription role={status === 'error' ? 'alert' : 'status'}>
                {status === 'loading'
                  ? (props.loadingMessage ?? SELECT_MENU_DEFAULTS.loadingMessage)
                  : (props.errorMessage ?? SELECT_MENU_DEFAULTS.errorMessage)}
              </FieldDescription>
            )}
          </ComboboxContent>
          {(props.clearable ?? FORM_MENU_DEFAULTS.clearable) && (
            <Button
              type="button"
              variant="ghost"
              aria-label={`${SELECT_MENU_DEFAULTS.clearLabel} ${props.label}`}
              disabled={Boolean(blocked)}
              onClick={() => {
                if (accept(props.mode === 'multiple' ? [] : ''))
                  triggerRef.current?.focus();
              }}
            >
              {SELECT_MENU_DEFAULTS.clearLabel}
            </Button>
          )}
        </Combobox>
        {props.description && (
          <FieldDescription id={`${props.id}-help`}>
            {props.description}
          </FieldDescription>
        )}
        {props.validationError && (
          <FieldError id={`${props.id}-error`}>{props.validationError}</FieldError>
        )}
        {error && <FieldError id={`${props.id}-request`}>{error}</FieldError>}
      </Field>
    </DirectionProvider>
  );
}
