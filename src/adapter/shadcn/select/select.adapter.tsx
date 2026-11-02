import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId, type Ref } from 'react';
import { useFormContext } from 'react-hook-form';
import { ManagedFormField } from '../form/managed-field.js';
import { FieldError } from '../vendor/ui/field.js';
import { SELECT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/select-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import type { SelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/select/select.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../vendor/ui/select.js';
import { Label } from '../vendor/ui/label.js';
import { Button } from '../vendor/ui/button.js';
import { MultipleSelect } from './multiple-select.js';

import { useShadcnTheme } from '../surface/theme-context.js';

export type ShadcnSelectProps = SelectProps;
export function ShadcnSelect(properties: SelectProps) {
  const form = useFormContext<Record<string, unknown>>();
  const field = useNativeField(properties);
  const id = useId();
  if (!form || properties.mode === 'multiple') {
    return <SelectControl {...properties} />;
  }
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([field.error, field.required])}
      control={form.control}
      defaultValue={properties.value}
      disabled={field.disabled}
      rules={{
        validate: () =>
          field.error ||
          !field.required ||
          properties.value !== '' ||
          SELECT_POLICY.singleRequiredMessage,
      }}
      render={({ field: native, fieldState }) => (
        <SelectControl
          {...properties}
          managed
          inputRef={native.ref}
          onBlur={native.onBlur}
          validationError={fieldState.error?.message}
          onValueChange={(value) => {
            properties.onValueChange(value);
            native.onChange(value);
          }}
        />
      )}
    />
  );
}

type SelectControlProps = SelectProps & {
  readonly managed?: boolean | undefined;
  readonly inputRef?: Ref<HTMLButtonElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly validationError?: string | undefined;
};

function SelectControl({ inputRef, ...properties }: SelectControlProps) {
  const id = useId();
  const theme = useShadcnTheme();
  const { label, description, placeholder, readOnly, loading, clearable } = properties;
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  const popup = useNativePopup(!metadata.disabled && !loading);
  const error = properties.validationError || metadata.error;
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
      <Label htmlFor={id}>{label}</Label>
      {properties.mode === 'multiple' ? (
        <MultipleSelect {...properties} id={id} />
      ) : (
        <Select
          open={popup.open}
          onOpenChange={popup.onOpenChange}
          value={properties.value}
          name={metadata.name}
          required={properties.managed ? false : metadata.required}
          disabled={metadata.disabled || loading}
          onValueChange={(next) => {
            requestNativeChange(Boolean(readOnly || metadata.blocked), () =>
              properties.onValueChange(next),
            );
          }}
        >
          <SelectTrigger
            style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
            className={[
              'h-auto min-h-9 min-w-0 max-w-full whitespace-normal',
              '[&>span]:min-w-0 [&>span]:line-clamp-none',
              '[&>span]:whitespace-normal [&>span]:[overflow-wrap:anywhere]',
              '[&>svg]:shrink-0',
            ].join(' ')}
            ref={inputRef}
            id={id}
            onBlur={properties.onBlur}
            aria-required={metadata.required}
            aria-readonly={readOnly}
            aria-busy={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [
                ...metadata.descriptionIds,
                ...(properties.validationError ? [`${id}-error`] : []),
              ].join(' ') || undefined
            }
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            aria-label={label}
            container={popup.host}
            inert={!popup.active}
            onCloseAutoFocus={(event) => {
              if (!popup.active) event.preventDefault();
            }}
            collisionPadding={SELECT_POLICY.popupCollisionPaddingPx}
            sideOffset={SELECT_POLICY.popupSideOffsetPx}
            className={[
              'motion-reduce:animate-none',
              '[&_[data-radix-select-viewport]]:min-w-0',
              '[&_[data-radix-select-viewport]]:max-w-full',
            ].join(' ')}
            style={{
              ...theme,
              maxInlineSize: 'var(--radix-select-content-available-width)',
              minInlineSize: 0,
            }}
          >
            {properties.items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={item.disabled || readOnly}
                className={[
                  'min-w-0 whitespace-normal',
                  '[&>span:last-child]:min-w-0',
                  '[&>span:last-child]:whitespace-normal',
                  '[&>span:last-child]:[overflow-wrap:anywhere]',
                ].join(' ')}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {clearable && (
        <Button
          type="button"
          variant="ghost"
          aria-label={`Clear ${label}`}
          disabled={metadata.blocked || loading || readOnly}
          onClick={() => {
            if (properties.mode === 'multiple') properties.onValueChange([]);
            else properties.onValueChange('');
          }}
        >
          Clear
        </Button>
      )}
      {properties.validationError && (
        <FieldError id={`${id}-error`}>{properties.validationError}</FieldError>
      )}
      {description && <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
