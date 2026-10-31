import { useContext, useId } from 'react';
import type { LocaleSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/locale-select/index.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select.js';
import { Label } from '../primitives/label.js';
import { SharedSelectContent } from '../select/select-content.adapter.js';

export function SharedLocaleSelect({
  label,
  value,
  locales,
  onValueChange,
  name,
  required,
  description,
  disabled,
  readOnly,
}: LocaleSelectProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  const selectedLabel = locales.reduce(
    (selected, locale) => (locale.code === value ? locale.label : selected),
    value,
  );
  return (
    <div className="reacd-node reacd-field reacd-locale-select">
      <Label htmlFor={id}>{label}</Label>
      <Select
        key={active ? 'active' : 'inactive'}
        value={value}
        name={name}
        required={required}
        disabled={disabled}
        {...(active ? {} : { open: false })}
        onValueChange={(next) => {
          if (!readOnly) onValueChange(next);
        }}
      >
        <SelectTrigger
          id={id}
          className="reacd-locale-trigger"
          aria-readonly={readOnly || undefined}
          aria-describedby={description === undefined ? undefined : `${id}-help`}
        >
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SharedSelectContent>
          {locales.map((locale) => (
            <SelectItem
              key={locale.code}
              value={locale.code}
              className="reacd-locale-option"
            >
              {locale.label}
            </SelectItem>
          ))}
        </SharedSelectContent>
      </Select>
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
    </div>
  );
}
