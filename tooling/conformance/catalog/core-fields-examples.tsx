import { VStack } from '@fastsprout/reacd';
import { CodeEditorExample } from '../../../docs/examples/code-editor.js';
import { SubmitButtonExample } from '../../../docs/examples/submit-button.js';
import { TextAreaExample } from '../../../docs/examples/text-area.js';
import { ToggleExample } from '../../../docs/examples/toggle.js';
import { ViewBoundary } from '../loading/view-boundary.js';

export function CoreFieldsExamples() {
  return (
    <VStack>
      <ViewBoundary label="CodeEditor"><CodeEditorExample /></ViewBoundary>
      <SubmitButtonExample />
      <TextAreaExample />
      <ToggleExample />
    </VStack>
  );
}
