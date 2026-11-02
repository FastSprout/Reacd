import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { readUploadBytes } from '@fastsprout/reacd';
import { fileUploadSchema } from '../../src/schema/file-upload/index.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { formSchema } from '../../src/schema/form/form.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { FileUploadExample } from './file-upload.js';

it(
  'reports native unavailability and preserves file bytes, vetoes and host state',
  () => {
  expectUnsupportedExample(<FileUploadExample />, 'FileUpload');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <FileUploadExample />
    </probe.Surface>,
  );
  const read = () => probe.read('FileUpload', fileUploadSchema, 'Attachments');
  const press = (label: string) =>
    act(() => probe.read('Button', buttonSchema, label).onPress());
  const toggle = (label: string) =>
    act(() => {
      const value = probe.read('Toggle', toggleSchema, label);
      value.onCheckedChange(!value.checked);
    });
  expect(read().value).toEqual([]);
  expect(read().required).toBe(true);
  expect(probe.texts()).toContain('No content yet.');
  press('Restore sample file');
  const sample = read().value[0];
  if (!sample) throw new Error('Missing sample file');
  expect([...readUploadBytes(sample)]).toEqual([72, 101, 108, 108, 111]);
  expect(probe.texts()).toContain(`${sample.name}: 5 bytes`);
  toggle('Reject file changes');
  act(() => read().onValueChange([]));
  expect(read().value).toEqual([sample]);
  toggle('Read-only files');
  toggle('Disable files');
  expect(read().readOnly).toBe(true);
  expect(read().disabled).toBe(true);
  toggle('Disable files');
  toggle('Read-only files');
  toggle('Reject file changes');
  toggle('Right to left files');
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  act(() => read().onValueChange([{ ...sample, id: 'local', name: 'local.txt' }]));
  expect(read().value[0]?.name).toBe('local.txt');
  act(() => probe.read('Form', formSchema, 'Files form').onSubmit());
  expect(probe.texts()).toContain('Files saved.');
  press('Clear files');
  expect(read().value).toEqual([]);
  expect(probe.texts()).toContain('No content yet.');
});
