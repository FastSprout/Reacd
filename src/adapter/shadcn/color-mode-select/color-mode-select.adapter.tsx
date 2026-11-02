import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import { useNativePopup } from '../surface/use-native-popup.js';
import { useDirection } from '@radix-ui/react-direction';
import type { ColorModeSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-select/index.js';
import {
  COLOR_MODES,
  COLOR_MODE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { colorModeValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode/color-mode.schema.js';
import { useNativeField } from '../form-field/use-native-field.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../vendor/ui/select.js';
import { Label } from '../vendor/ui/label.js';
import { useShadcnTheme } from '../surface/theme-context.js';

export type ShadcnColorModeSelectProps = ColorModeSelectProps;
export function ShadcnColorModeSelect({
  label,
  description,
  disabled,
  readOnly,
  value,
  onValueChange,
  labels = COLOR_MODE_POLICY.labels,
}: ColorModeSelectProps) {
  const id = useId();
  const theme = useShadcnTheme();
  const direction = useDirection();
  const metadata = useNativeField({ disabled }, description ? [`${id}-help`] : []);
  const popup = useNativePopup(!metadata.disabled);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        open={popup.open}
        onOpenChange={popup.onOpenChange}
        value={value}
        disabled={metadata.disabled}
        onValueChange={(next) => {
          requestNativeChange(Boolean(readOnly || metadata.blocked), () =>
            onValueChange(colorModeValueSchema.parse(next)),
          );
        }}
      >
        <SelectTrigger
          id={id}
          aria-readonly={readOnly}
          aria-describedby={metadata.descriptionIds.join(' ') || undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          container={popup.host}
          inert={!popup.active}
          onCloseAutoFocus={(event) => {
            if (!popup.active) event.preventDefault();
          }}
          className="motion-reduce:animate-none"
          style={theme}
          dir={direction}
        >
          {COLOR_MODES.map((mode) => (
            <SelectItem key={mode} value={mode} disabled={readOnly}>
              {labels[mode]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
