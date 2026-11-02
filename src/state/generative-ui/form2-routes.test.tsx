import { act, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { GenerativeNodeView } from './node-view.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { RenderContext } from '../../components/shared/port.js';
import { colorPickerSchema } from '../../schema/color-picker/index.js';
import { fileUploadSchema } from '../../schema/file-upload/index.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { exampleDeclarationProbe, expectUnsupportedExample } from
  '../../../test-support/example-declaration-probe.js';
import { success } from '../../../test-support/data-table.js';

const state = [
  { key: 'color', kind: 'text', initial: '#ff0000', access: 'readWrite' },
  { key: 'files', kind: 'fileList', access: 'readWrite', initial: [{
    id: 'saved', name: 'saved.txt', mediaType: 'text/plain', size: 5,
    lastModified: 0, content: { encoding: 'base64', data: 'SGVsbG8=' },
  }] },
];
const color = { type: 'ColorPicker', label: 'Routed color', mode: 'rgb',
  value: { state: 'color', mode: 'readWrite' } };
const files = { type: 'FileUpload', label: 'Routed files',
  value: { state: 'files', mode: 'readWrite' } };
const documentModel = { schemaVersion: '0.2', state,
  root: { type: 'VStack', children: [color, files] } };

it.each([['ColorPicker', color], ['FileUpload', files]] as const)(
  'reports the exact actual %s native boundary', (name, root) => {
    expectUnsupportedExample(<GenerativeUI
      document={{ ...documentModel, root }} />, name);
  },
);

it('routes validated canonical color and complete file proposals into real state',
  () => {
    const registry = success(createStateRegistry(state));
    const isolated = success(createStateRegistry(state));
    const parsed = success(validateGenerativeDocument(documentModel));
    const probe = exampleDeclarationProbe();
    const notify = vi.fn();
    const stop = success(registry.subscribe('files', notify));
    const view = render(<RenderContext.Provider value={probe.port}>
      <GenerativeNodeView node={parsed.root} registry={registry} actions={{}} />
    </RenderContext.Provider>);
    try {
      expect(probe.read('FileUpload', fileUploadSchema).value).toEqual(
        success(registry.read('files')).value,
      );
      act(() => { probe.read('ColorPicker', colorPickerSchema)
        .onValueChange('#abcdef'); });
      expect(success(registry.read('color')).value).toBe('#abcdef');
      act(() => { probe.read('ColorPicker', colorPickerSchema)
        .onValueChange('#ABCDEF'); });
      expect(success(registry.read('color')).value).toBe('#abcdef');
      act(() => { probe.read('FileUpload', fileUploadSchema).onValueChange([]); });
      expect(success(registry.read('files')).value).toEqual([]);
      expect(probe.read('FileUpload', fileUploadSchema).value).toEqual([]);
      expect(notify).toHaveBeenCalledExactlyOnceWith({
        key: 'files', kind: 'fileList', value: [],
      });
      expect(success(isolated.read('color')).value).toBe('#ff0000');
      expect(success(isolated.read('files')).value).toEqual(state[1]?.initial);
    } finally {
      view.unmount();
      stop();
    }
  });
