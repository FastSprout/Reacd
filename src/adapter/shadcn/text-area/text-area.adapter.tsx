import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { TextAreaProps } from
  '@fastsprout/reacd/adapter-runtime/components/text-area/text-area.props.js';
import { CONTENT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Textarea } from '../vendor/ui/textarea.js';
import { Label } from '../vendor/ui/label.js';

export type ShadcnTextAreaProps = TextAreaProps;
export function ShadcnTextArea({
  label,
  value,
  onValueChange,
  placeholder,
  rows = CONTENT_POLICY.defaultTextAreaRows,
  ...properties
}: TextAreaProps) {
  const id = useId();
  const metadata = useNativeField(properties);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={metadata.disabled}
        required={metadata.required}
        name={metadata.name}
        aria-invalid={Boolean(metadata.error)}
        aria-describedby={metadata.descriptionIds.join(' ') || undefined}
        onChange={(event) => {
          requestNativeChange(metadata.blocked, () =>
            onValueChange(event.target.value),
          );
        }}
      />
    </div>
  );
}
