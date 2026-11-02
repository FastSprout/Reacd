import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  GenerativeUI,
  createStateRegistry,
  validateGenerativeDocument,
} from '@fastsprout/reacd/generative';
import { success } from '../../../test-support/data-table.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { RenderContext } from '../../components/shared/port.js';
import { GenerativeNodeView } from '../../state/generative-ui/node-view.js';
import { fileUploadSchema } from './index.js';
import { colorPickerSchema } from '../color-picker/index.js';
const FILE = {
  id: 'saved',
  name: 'saved.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
const documentModel = {
  schemaVersion: '0.2',
  state: [
    { key: 'files', kind: 'fileList', initial: [FILE], access: 'readWrite' },
    { key: 'color', kind: 'text', initial: '#112233', access: 'readWrite' },
  ],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'FileUpload',
        label: 'Files',
        value: { state: 'files', mode: 'readWrite' },
      },
      {
        type: 'ColorPicker',
        mode: 'rgb',
        label: 'Color',
        value: {
          state: 'color',
          mode: 'readWrite',
        },
      },
    ],
  },
};
it.each(['FileUpload', 'ColorPicker'] as const)(
  'reports the exact %s SDK exception after transport validation', (component) => {
    const root = documentModel.root.children.find(node => node.type === component);
    const input = { ...documentModel, root };
    expect(validateGenerativeDocument(input).success).toBe(true);
    expectUnsupportedExample(<GenerativeUI document={input} />, component);
  },
);

it('projects canonical payload routes without inventing native controls', () => {
  const parsed = success(validateGenerativeDocument(documentModel));
  const registry = success(createStateRegistry(documentModel.state));
  const probe = exampleDeclarationProbe();
  render(<RenderContext.Provider value={probe.port}>
    <GenerativeNodeView node={parsed.root} registry={registry} actions={{}} />
  </RenderContext.Provider>);
  expect(probe.read('FileUpload', fileUploadSchema).value).toEqual([FILE]);
  act(() => { probe.read('FileUpload', fileUploadSchema).onValueChange([]); });
  expect(success(registry.read('files')).value).toEqual([]);
  expect(probe.read('FileUpload', fileUploadSchema).value).toEqual([]);
  act(() => { probe.read('ColorPicker', colorPickerSchema)
    .onValueChange('#abcdef'); });
  expect(success(registry.read('color')).value).toBe('#abcdef');
  act(() => { probe.read('ColorPicker', colorPickerSchema)
    .onValueChange('#ABCDEF'); });
  expect(success(registry.read('color')).value).toBe('#abcdef');
});
it('rejects wrong state kinds, mode violations and oversized initial documents', () => {
  for (const root of [
    {
      type: 'FileUpload',
      label: 'Files',
      accept: 'pdf',
      value: {
        state: 'files',
        mode: 'read',
      },
    },
    {
      type: 'ColorPicker',
      label: 'Color',
      mode: 'rgba',
      value: {
        state: 'color',
        mode: 'read',
      },
    },
    { type: 'FileUpload', label: 'Files', value: { state: 'color', mode: 'read' } },
  ])
    expect(validateGenerativeDocument({ ...documentModel, root }).success).toBe(false);
  const data = 'AAAA'.repeat(250_001);
  expect(
    validateGenerativeDocument({
      ...documentModel,
      state: [
        {
          key: 'files',
          kind: 'fileList',
          access: 'readWrite',
          initial: [{ ...FILE, size: 750_003, content: { encoding: 'base64', data } }],
        },
      ],
    }).success,
  ).toBe(false);
});
