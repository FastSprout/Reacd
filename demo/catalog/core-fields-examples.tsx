import { VStack } from 'reacd';
import { CodeEditorExample } from '../../docs/examples/code-editor.js';
import { SubmitButtonExample } from '../../docs/examples/submit-button.js';
import { TextAreaExample } from '../../docs/examples/text-area.js';
import { ToggleExample } from '../../docs/examples/toggle.js';

export function CoreFieldsExamples() {
  return (
    <VStack>
      <CodeEditorExample />
      <SubmitButtonExample />
      <TextAreaExample />
      <ToggleExample />
    </VStack>
  );
}
