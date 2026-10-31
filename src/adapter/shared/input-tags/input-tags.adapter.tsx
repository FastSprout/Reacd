import { useId } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { XIcon } from 'lucide-react';
import type { InputTagsProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-tags/index.js';
import {
  INPUT_TAGS_POLICY,
  TAG_DELIMITER_CHARACTERS,
} from '@fastsprout/reacd/adapter-runtime/core/input-tags-policy.js';
import { Label } from '../primitives/label.js';
import { useTagDraft } from './use-tag-draft.js';

export function SharedInputTags(properties: InputTagsProps) {
  const {
    label,
    description,
    value,
    onValueChange,
    placeholder,
    disabled,
    readOnly,
    name,
    required,
    addOnTab,
    addOnBlur,
    addOnPaste,
    delimiters = INPUT_TAGS_POLICY.delimiters,
  } = properties;
  const id = useId();
  const entry = useTagDraft(properties);
  const describedBy = [
    description === undefined ? '' : `${id}-help`,
    entry.error === undefined ? '' : `${id}-error`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="reacd-node reacd-field reacd-input-tags">
      <Label htmlFor={id}>{label}</Label>
      <Combobox.Root
        multiple
        open={false}
        items={[...value]}
        value={value}
        inputValue={entry.draft}
        onInputValueChange={entry.change}
        onValueChange={(next) => {
          onValueChange(next);
        }}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        required={required}
      >
        <Combobox.Chips className="reacd-tags-chips">
          {value.map((tag) => (
            <Combobox.Chip key={tag} className="reacd-tags-chip">
              <span className="reacd-tags-text">{tag}</span>
              <Combobox.ChipRemove
                className="reacd-tags-remove"
                aria-label={`Remove ${tag}`}
              >
                <XIcon aria-hidden="true" />
              </Combobox.ChipRemove>
            </Combobox.Chip>
          ))}
          <Combobox.Input
            id={id}
            className="reacd-tags-input"
            placeholder={placeholder}
            aria-invalid={entry.error !== undefined}
            aria-describedby={describedBy || undefined}
            aria-autocomplete="none"
            onCompositionStart={() => {
              entry.setComposing(true);
            }}
            onCompositionEnd={() => {
              entry.setComposing(false);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || entry.composing.current) return;
              const delimiter = delimiters.some(
                (item) => TAG_DELIMITER_CHARACTERS[item] === event.key,
              );
              const trigger =
                event.key === 'Enter' || delimiter || (event.key === 'Tab' && addOnTab);
              if (!trigger || entry.draft.trim() === '') return;
              if (event.key !== 'Tab') event.preventDefault();
              entry.commit(entry.draft);
            }}
            onBlur={() => {
              if (addOnBlur && entry.draft.trim() !== '') entry.commit(entry.draft);
            }}
            onPaste={(event) => {
              if (!addOnPaste || entry.composing.current) return;
              event.preventDefault();
              const start = event.currentTarget.selectionStart ?? entry.draft.length;
              const end = event.currentTarget.selectionEnd ?? entry.draft.length;
              entry.commit(
                entry.draft.slice(0, start) +
                  event.clipboardData.getData('text') +
                  entry.draft.slice(end),
              );
            }}
          />
        </Combobox.Chips>
      </Combobox.Root>
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
      {entry.error === undefined ? null : (
        <span id={`${id}-error`} role="alert">
          {entry.error}
        </span>
      )}
    </div>
  );
}
