import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { ShadcnFileUpload } from './file-upload.adapter.js';
import type { UploadFile } from '../../../schema/file-upload/upload-file.schema.js';
const FILE: UploadFile = {
  id: 'saved',
  name: 'saved.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
function Host() {
  const [value, onValueChange] = useState<readonly UploadFile[]>([]);
  return (
    <ShadcnFileUpload
      label="Attachments"
      name="files"
      required
      value={value}
      onValueChange={onValueChange}
      description="Text documents"
    />
  );
}
it('reads bytes, appends, removes and serializes real payloads', async () => {
  const user = userEvent.setup();
  const view = render(
    <form>
      <Host />
    </form>,
  );
  const chooser = screen.getByLabelText('Attachments', { selector: 'input' });
  await user.upload(
    chooser,
    new File(['Hello'], 'note.txt', {
      type: 'text/plain',
      lastModified: 0,
    }),
  );
  await screen.findByText('note.txt');
  const form = view.container.querySelector('form');
  expect(form?.checkValidity()).toBe(true);
  if (!form) throw new Error('Missing form');
  const payload = new FormData(form).get('files');
  expect(typeof payload).toBe('string');
  expect(payload).toContain('SGVsbG8=');
  await user.upload(
    chooser,
    new File([new Uint8Array([0, 255, 128])], 'bytes.bin', {
      lastModified: 0,
    }),
  );
  await screen.findByText('bytes.bin');
  expect(new FormData(form).get('files')).toContain('AP+A');
  await user.click(screen.getByRole('button', { name: 'Remove note.txt' }));
  expect(screen.queryByText('note.txt')).toBeNull();
  expect(screen.getByText('bytes.bin')).toBeVisible();
});
it('protects controlled values during drop and removal', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(
    <ShadcnFileUpload label="Files" value={[FILE]} onValueChange={changed} />,
  );
  await user.click(screen.getByRole('button', { name: 'Remove saved.txt' }));
  expect(changed).toHaveBeenLastCalledWith([]);
  expect(screen.getByText('saved.txt')).toBeVisible();
  changed.mockClear();
  fireEvent.dragOver(screen.getByRole('group', { name: 'Files' }));
  fireEvent.drop(screen.getByRole('group', { name: 'Files' }), {
    dataTransfer: {
      files: [
        new File(['Hello'], 'drop.txt', {
          type: 'text/plain',
          lastModified: 0,
        }),
      ],
    },
  });
  await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
  expect(changed.mock.calls[0]?.[0]).toEqual([
    FILE,
    expect.objectContaining({
      name: 'drop.txt',
      content: { encoding: 'base64', data: 'SGVsbG8=' },
    }),
  ]);
  view.rerender(
    <ShadcnFileUpload
      label="Files"
      value={[FILE]}
      onValueChange={changed}
      readOnly
      name="files"
    />,
  );
  expect(screen.queryByRole('button')).toBeNull();
  fireEvent.drop(screen.getByRole('group', { name: 'Files' }), {
    dataTransfer: { files: [new File(['x'], 'blocked')] },
  });
  expect(changed).toHaveBeenCalledTimes(1);
  view.rerender(
    <ShadcnFileUpload label="Files" value={[FILE]} onValueChange={changed} disabled />,
  );
  expect(screen.getByRole('button', { name: 'Choose files' })).toBeDisabled();
});
it('validates required payloads and focuses the chooser', async () => {
  const user = userEvent.setup();
  render(
    <form>
      <Host />
      <button type="submit">Submit</button>
    </form>,
  );
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Choose at least one file.');
  expect(screen.getByRole('button', { name: 'Choose files' })).toHaveFocus();
  const click = vi.spyOn(HTMLInputElement.prototype, 'click');
  await user.keyboard('{Enter}');
  expect(click).toHaveBeenCalledExactlyOnceWith();
  click.mockRestore();
});
it('cancels pending chooser reads and ignores empty change events', async () => {
  const user = userEvent.setup();
  const read = vi
    .spyOn(FileReader.prototype, 'readAsDataURL')
    .mockImplementation(function (this: FileReader) {
      Object.defineProperty(this, 'readyState', { value: FileReader.LOADING });
    });
  const abort = vi.spyOn(FileReader.prototype, 'abort').mockImplementation(function (
    this: FileReader,
  ) {
    this.dispatchEvent(new ProgressEvent('abort'));
  });
  const changed = vi.fn();
  const view = render(
    <ShadcnFileUpload label="Pending" value={[]} onValueChange={changed} />,
  );
  const chooser = screen.getByLabelText('Pending', { selector: 'input' });
  fireEvent.change(chooser, { target: { files: null } });
  expect(read).not.toHaveBeenCalled();
  fireEvent.change(chooser, { target: { files: [new File(['x'], 'x.txt')] } });
  expect(screen.getByRole('status')).toHaveTextContent('Reading files');
  await user.click(screen.getByRole('button', { name: 'Cancel reading' }));
  expect(screen.getByRole('status')).toHaveTextContent('Reading canceled.');
  expect(screen.getByRole('button', { name: 'Choose files' })).toHaveFocus();
  expect(abort).toHaveBeenCalledExactlyOnceWith();
  expect(changed).not.toHaveBeenCalled();
  view.unmount();
  read.mockRestore();
  abort.mockRestore();
});
it('reports invalid batches and focuses readonly required errors', async () => {
  const changed = vi.fn();
  const view = render(
    <form>
      <ShadcnFileUpload
        label="Protected"
        value={[]}
        onValueChange={changed}
        readOnly
        required
        name="files"
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  expect(form?.checkValidity()).toBe(false);
  expect(screen.getByRole('group', { name: 'Protected' })).toHaveFocus();
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Choose at least one file.',
  );
  view.rerender(
    <ShadcnFileUpload
      label="Protected"
      value={[]}
      onValueChange={changed}
      accept="pdf"
    />,
  );
  fireEvent.drop(screen.getByRole('group', { name: 'Protected' }), {
    dataTransfer: { files: [new File(['x'], 'x.txt', { type: 'text/plain' })] },
  });
  expect(screen.getByRole('alert')).toHaveTextContent('not accepted');
  expect(changed).not.toHaveBeenCalled();
});
