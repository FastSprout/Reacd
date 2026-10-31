import { useId } from 'react';
import type { CodeEditorProps } from
  '@fastsprout/reacd/adapter-runtime/components/code-editor/code-editor.js';
import {
  CONTENT_POLICY,
  DOCUMENT_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Textarea } from '../primitives/textarea.js';
import { Label } from '../primitives/label.js';

export function SharedCodeEditor({ label, value, onValueChange }: CodeEditorProps) {
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
