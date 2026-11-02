import type { Ref } from 'react';
import { SELECT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/select-policy.js';
import { useDirection } from '@radix-ui/react-direction';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { MultipleSelectProps } from './multiple-select.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../vendor/ui/base-select.js';
import { FieldError, FieldDescription } from '../vendor/ui/field.js';

interface MultipleSelectControlProps extends MultipleSelectProps {
  readonly managed?: boolean | undefined;
  readonly inputRef?: Ref<HTMLButtonElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
}

export function MultipleSelectControl({
  inputRef,
  ...props
}: MultipleSelectControlProps) {
  const field = useNativeField(props);
  const popup = useNativePopup(!field.disabled && !props.loading && !props.readOnly);
  const direction = useDirection();
  const theme = useShadcnTheme();
  const error = props.error || field.error;
  const blocked = Boolean(field.blocked || props.loading || props.readOnly);
  return (
    <DirectionProvider direction={direction}>
      <Select<string, true>
        multiple
        items={props.items}
        value={[...props.value]}
        name={field.name}
        open={popup.open}
        onOpenChange={popup.onOpenChange}
        disabled={field.disabled}
        readOnly={blocked}
        required={props.managed ? false : field.required}
        onValueChange={(value) => {
          props.onValueChange(Object.freeze([...value]));
        }}
      >
        <SelectTrigger
          ref={inputRef}
          id={props.id}
          aria-label={props.label}
          aria-readonly={props.readOnly}
          aria-required={field.required}
          aria-invalid={Boolean(error)}
          aria-busy={props.loading}
          onBlur={props.onBlur}
          aria-describedby={
            [
              ...field.descriptionIds,
              ...(props.error ? [`${props.id}-error`] : []),
            ].join(' ') || undefined
          }
          className="h-auto w-full min-w-0 max-w-full whitespace-normal"
        >
          <SelectValue placeholder={props.placeholder ?? SELECT_POLICY.placeholder} />
        </SelectTrigger>
        <SelectContent
          container={popup.host ?? undefined}
          dir={direction}
          style={theme}
          finalFocus={popup.active ? undefined : false}
          aria-label={props.label}
        >
          {props.items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              label={item.label}
              aria-label={item.label}
              aria-description={item.description}
              disabled={item.disabled}
              className="whitespace-normal [overflow-wrap:anywhere]"
            >
              {item.label}
              {item.description && (
                <FieldDescription>{item.description}</FieldDescription>
              )}
            </SelectItem>
          ))}
        </SelectContent>
        {props.error && <FieldError id={`${props.id}-error`}>{props.error}</FieldError>}
      </Select>
    </DirectionProvider>
  );
}
