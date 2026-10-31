import { expect, it, vi } from 'vitest';
import { readFile } from './read-file.js';
it('reads native content and cleans reader handlers', async () => {
  const result = readFile(new File(['Hello'], 'hello.txt', { type: 'text/plain' }));
  await expect(result.promise).resolves.toBe('SGVsbG8=');
  await expect(readFile(new File([], 'empty.bin')).promise).resolves.toBe('');
});
it('rejects malformed, failed, aborted and thrown reads', async () => {
  for (const result of [null, new ArrayBuffer(0), 'broken', 'data:bad', 'data:,abc']) {
    const read = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function (this: FileReader) {
        Object.defineProperty(this, 'result', { value: result });
        this.dispatchEvent(new ProgressEvent('load'));
      });
    await expect(readFile(new File([], 'test')).promise).rejects.toThrow();
    const reader = read.mock.contexts[0];
    if (!(reader instanceof FileReader)) throw new Error('Expected native reader');
    expect(reader.onload).toBeNull();
    expect(reader.onerror).toBeNull();
    expect(reader.onabort).toBeNull();
    read.mockRestore();
  }
  const read = vi
    .spyOn(FileReader.prototype, 'readAsDataURL')
    .mockImplementation(function (this: FileReader) {
      this.dispatchEvent(new ProgressEvent('error'));
    });
  await expect(readFile(new File([], 'test')).promise).rejects.toThrow();
  read.mockRestore();
  const task = readFile(new File(['Hello'], 'test'));
  task.cancel();
  await expect(task.promise).rejects.toThrow();
  const fail = vi
    .spyOn(FileReader.prototype, 'readAsDataURL')
    .mockImplementation(() => {
      throw new Error('Unavailable');
    });
  await expect(readFile(new File([], 'test')).promise).rejects.toThrow('Unavailable');
  fail.mockRestore();
});
