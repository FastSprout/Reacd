import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import {
  GenerativeUI,
  createStateRegistry,
  validateGenerativeDocument,
} from '@fastsprout/reacd/generative';
import { success } from '../../../test-support/data-table.js';
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
it('renders canonical file and color generative state routes', async () => {
  const user = userEvent.setup();
  expect(validateGenerativeDocument(documentModel).success).toBe(true);
  const registry = success(createStateRegistry(documentModel.state));
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={documentModel}
      registry={registry}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Remove saved.txt' }));
  expect(success(registry.read('files')).value).toEqual([]);
  const hex = screen.getByRole('textbox', { name: 'Color hexadecimal' });
  await user.clear(hex);
  await user.type(hex, '#ABCDEF{Enter}');
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
