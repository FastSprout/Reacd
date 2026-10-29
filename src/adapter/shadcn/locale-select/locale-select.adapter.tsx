import { useContext, useId } from 'react';
import type { LocaleSelectProps } from '../../../components/locale-select/index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { Select, SelectItem, SelectTrigger, SelectValue } from '../vendor/ui/select.js';
import { Label } from '../vendor/ui/label.js';
import { ShadcnSelectContent } from '../select/select-content.adapter.js';

export function ShadcnLocaleSelect({
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
        <ShadcnSelectContent>
          {locales.map((locale) => (
            <SelectItem
              key={locale.code}
              value={locale.code}
              className="reacd-locale-option"
            >
              {locale.label}
            </SelectItem>
          ))}
        </ShadcnSelectContent>
      </Select>
      {description === undefined ? null : (
        <span id={`${id}-help`} className="reacd-field-description">
          {description}
        </span>
      )}
    </div>
  );
}
