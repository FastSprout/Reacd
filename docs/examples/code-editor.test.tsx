import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { codeEditorSchema } from '../../src/schema/code-editor/code-editor.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { CodeEditorExample } from './code-editor.js';

it('reports native unavailability and retains accepted source state', () => {
  expectUnsupportedExample(<CodeEditorExample />, 'CodeEditor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <CodeEditorExample />
    </probe.Surface>,
  );
  const read = () => probe.read('CodeEditor', codeEditorSchema, 'Editable source');
  expect(read().value).toBe('Draft source');
  act(() => read().onValueChange('Updated source'));
  expect(read().value).toBe('Updated source');
  expect(probe.texts()).toContain('Current source: Updated source');
});
