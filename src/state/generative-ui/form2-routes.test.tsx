import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

it('routes color and file edits through the whole generative boundary', async () => {
  const user = userEvent.setup();
  const state = [
    { key: 'color', kind: 'text', initial: '#ff0000', access: 'readWrite' },
    {
      key: 'files',
      kind: 'fileList',
      access: 'readWrite',
      initial: [
        {
          id: 'saved',
          name: 'saved.txt',
          mediaType: 'text/plain',
          size: 5,
          lastModified: 0,
          content: { encoding: 'base64', data: 'SGVsbG8=' },
        },
      ],
    },
  ];
  const registry = success(createStateRegistry(state));
  render(
    <GenerativeUI
      registry={registry}
      document={{
        schemaVersion: '0.2',
        state,
        root: {
          type: 'VStack',
          children: [
            {
              type: 'ColorPicker',
              label: 'Routed color',
              mode: 'rgb',
              value: { state: 'color', mode: 'readWrite' },
            },
            {
              type: 'FileUpload',
              label: 'Routed files',
              value: { state: 'files', mode: 'readWrite' },
            },
          ],
        },
      }}
    />,
  );
  const color = screen.getByRole('textbox', { name: 'Routed color hexadecimal' });
  await user.clear(color);
  await user.type(color, '#ABCDEF{Enter}');
  expect(success(registry.read('color')).value).toBe('#abcdef');
  await user.click(screen.getByRole('button', { name: 'Remove saved.txt' }));
  expect(success(registry.read('files')).value).toEqual([]);
  expect(screen.queryByText('saved.txt')).toBeNull();
});
