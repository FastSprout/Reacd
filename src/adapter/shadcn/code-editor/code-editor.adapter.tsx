import { useId } from 'react';
import type { CodeEditorProps } from '../../../components/code-editor/code-editor.js';
import { CONTENT_POLICY, DOCUMENT_POLICY } from '../../../core/policy.js';
import { Textarea } from '../vendor/ui/textarea.js';
import { Label } from '../vendor/ui/label.js';

export function ShadcnCodeEditor({ label, value, onValueChange }: CodeEditorProps) {
  const id = useId();
  return (
    <div className="reacd-node reacd-field reacd-code-editor">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        spellCheck={false}
        rows={CONTENT_POLICY.codeEditorRows}
        maxLength={DOCUMENT_POLICY.maxCharacters}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}
