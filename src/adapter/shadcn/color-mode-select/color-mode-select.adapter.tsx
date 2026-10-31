import { useContext, useId } from 'react';
import type { ColorModeSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-select/index.js';
import {
  COLOR_MODES,
  COLOR_MODE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { colorModeValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode/color-mode.schema.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { Select, SelectItem, SelectTrigger, SelectValue } from '../vendor/ui/select.js';
import { Label } from '../vendor/ui/label.js';
import { ShadcnSelectContent } from '../select/select-content.adapter.js';

export function ShadcnColorModeSelect({
  label,
  value,
  resolvedMode: _resolved,
  onValueChange,
  disabled,
  readOnly,
  description,
  labels = COLOR_MODE_POLICY.labels,
}: ColorModeSelectProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  return (
    <div className="reacd-node reacd-field">
      <Label htmlFor={id}>{label}</Label>
      <Select
        key={active ? 'active' : 'inactive'}
        value={value}
        disabled={disabled}
        {...(active ? {} : { open: false })}
        onValueChange={(next) => {
          if (!readOnly) onValueChange(colorModeValueSchema.parse(next));
        }}
      >
        <SelectTrigger
          id={id}
          className="reacd-color-mode-select"
          aria-readonly={readOnly || undefined}
          aria-describedby={description === undefined ? undefined : `${id}-help`}
        >
          <SelectValue>{labels[value]}</SelectValue>
        </SelectTrigger>
        <ShadcnSelectContent>
          {COLOR_MODES.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {labels[mode]}
            </SelectItem>
          ))}
        </ShadcnSelectContent>
      </Select>
      {description === undefined ? null : <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
