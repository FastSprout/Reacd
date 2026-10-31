import { useId } from 'react';
import type { TextAreaProps } from
  '@fastsprout/reacd/adapter-runtime/components/text-area/text-area.js';
import { CONTENT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Textarea } from '../vendor/ui/textarea.js';
import { Label } from '../vendor/ui/label.js';

export function ShadcnTextArea({
  label,
  value,
  onValueChange,
  rows,
  ...properties
}: TextAreaProps) {
  const id = useId();
  return (
    <div className="reacd-node reacd-field">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        {...properties}
        id={id}
        value={value}
        rows={rows ?? CONTENT_POLICY.defaultTextAreaRows}
        maxLength={CONTENT_POLICY.maxTextLength}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}
