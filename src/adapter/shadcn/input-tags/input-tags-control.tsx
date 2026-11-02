import type { Ref } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { InputTagsProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-tags/input-tags.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { INPUT_TAGS_MESSAGES } from
  '@fastsprout/reacd/adapter-runtime/core/input-tags-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
} from '../vendor/ui/base-combobox.js';
import { Field, FieldLabel, FieldDescription, FieldError } from '../vendor/ui/field.js';
import { useTagDraft } from './use-tag-draft.js';
import { tagInputEvents } from './tag-input-events.js';

export interface InputTagsControlProps extends InputTagsProps {
  readonly id: string;
  readonly managed?: boolean | undefined;
  readonly inputRef?: Ref<HTMLInputElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly onAccepted?: ((value: readonly string[]) => void) | undefined;
  readonly validationError?: string | undefined;
}

export function InputTagsControl({ inputRef, ...props }: InputTagsControlProps) {
  const metadata = useNativeField(props, props.description ? [`${props.id}-help`] : []);
  const blocked = Boolean(metadata.blocked || props.readOnly);
  const entry = useTagDraft(props, blocked, props.onAccepted);
  const events = tagInputEvents(props, entry);
  const direction = useDirection();
  const error = entry.error || props.validationError;
  return (
    <DirectionProvider direction={direction}>
      <Field
        dir={direction}
        inert={metadata.blocked}
        className="min-w-0 max-w-full [overflow-wrap:anywhere]"
      >
        <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
        <Combobox<string, true>
          multiple
          open={false}
          value={props.value}
          items={props.value}
          inputValue={entry.draft}
          name={metadata.name}
          required={!props.managed && metadata.required}
          disabled={metadata.disabled}
          readOnly={blocked}
          onInputValueChange={entry.change}
          onValueChange={(next, event) => {
            if (!entry.request(next)) event.cancel();
          }}
        >
          <ComboboxChips className="min-w-0 max-w-full">
            {props.value.map((tag) => (
              <ComboboxChip
                key={tag}
                className={
                  'h-auto min-h-6 min-w-0 max-w-full whitespace-normal ' +
                  '[overflow-wrap:anywhere]'
                }
                removeProps={{
                  type: 'button',
                  disabled: blocked,
                  style: {
                    minInlineSize: LAYOUT_POLICY.controlTargetPx,
                    minBlockSize: LAYOUT_POLICY.controlTargetPx,
                  },
                  'aria-label': `${INPUT_TAGS_MESSAGES.removePrefix} ${tag}`,
                }}
              >
                {tag}
              </ComboboxChip>
            ))}
            <ComboboxChipsInput
              {...events}
              id={props.id}
              ref={inputRef}
              disabled={metadata.disabled}
              placeholder={props.placeholder}
              aria-label={props.label}
              aria-autocomplete="none"
              aria-required={metadata.required}
              aria-invalid={Boolean(metadata.error || error)}
              aria-describedby={
                [
                  ...metadata.descriptionIds,
                  ...(error ? [`${props.id}-error`] : []),
                ].join(' ') || undefined
              }
              className="max-w-full"
              onBlur={() => {
                events.onBlur();
                props.onBlur?.();
              }}
            />
          </ComboboxChips>
        </Combobox>
        {props.description && (
          <FieldDescription id={`${props.id}-help`}>
            {props.description}
          </FieldDescription>
        )}
        {error && <FieldError id={`${props.id}-error`}>{error}</FieldError>}
      </Field>
    </DirectionProvider>
  );
}
