import { expect, it, vi } from 'vitest';
import { FileIntake } from './intake.js';
import type { ReadTask } from './read-file.js';
import { FILE_UPLOAD_POLICY as P } from '../../../core/file-upload-policy.js';
import type { UploadFile } from '../../../schema/file-upload/upload-file.schema.js';
function harness(value: readonly UploadFile[] = []) {
  const onValueChange = vi.fn<(files: readonly UploadFile[]) => void>();
  const tasks: {
    resolve: (value: string) => void;
    reject: () => void;
    cancel: ReturnType<typeof vi.fn>;
  }[] = [];
  const read = vi.fn((): ReadTask => {
    let resolve = (_value: string): void => undefined;
    let reject = (): void => undefined;
    const promise = new Promise<string>((yes, no) => {
      resolve = yes;
      reject = () => no(new Error('read failed'));
    });
    const cancel = vi.fn(reject);
    tasks.push({ resolve, reject, cancel });
    return { promise, cancel };
  });
  let sequence = 0;
  const intake = new FileIntake({ read, id: () => `file-${sequence++}` });
  const host = { value, onValueChange };
  intake.configure(host);
  return { intake, read, tasks, onValueChange, host };
}
const FILE = new File(['Hello'], 'hello.txt', { type: 'text/plain', lastModified: 0 });
const flush = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};
it('reads atomically and preserves rejection and subscriptions', async () => {
  const h = harness();
  const changed = vi.fn();
  const stop = h.intake.subscribe(changed);
  expect(h.intake.getSnapshot().status).toBe('idle');
  h.intake.start([FILE]);
  expect(h.intake.getSnapshot().status).toBe('reading');
  h.tasks[0]?.resolve('SGVsbG8=');
  await flush();
  expect(h.onValueChange).toHaveBeenCalledExactlyOnceWith([
    {
      id: 'file-0',
      name: 'hello.txt',
      mediaType: 'text/plain',
      size: 5,
      lastModified: 0,
      content: { encoding: 'base64', data: 'SGVsbG8=' },
    },
  ]);
  expect(h.host.value).toEqual([]);
  expect(h.intake.getSnapshot().status).toBe('idle');
  expect(changed).toHaveBeenCalledTimes(2);
  stop();
  h.intake.start([FILE]);
  expect(changed).toHaveBeenCalledTimes(2);
  h.intake.cancel();
  await flush();
});
it('rejects the entire batch before reading any bytes when limits fail', () => {
  const h = harness();
  for (const settings of [
    { input: Array.from({ length: P.maxFiles + 1 }, () => FILE) },
    { input: [new File(['x'], '../../shadcn/path.txt')] },
    { input: [new File([], 'large')], maximum: true },
    { input: [FILE], accept: 'images' as const },
  ]) {
    h.intake.configure({ ...h.host, accept: settings.accept });
    if (settings.maximum)
      Object.defineProperty(settings.input[0], 'size', {
        value: P.maxFileBytes + 1,
      });
    h.intake.start(settings.input);
    expect(h.intake.getSnapshot().status).toBe('error');
  }
  const big = new File([], 'big');
  Object.defineProperty(big, 'size', { value: P.maxFileBytes });
  h.intake.configure(h.host);
  h.intake.start([big, big, big]);
  expect(h.intake.getSnapshot().status).toBe('error');
  expect(h.read).not.toHaveBeenCalled();
  h.intake.start([]);
  expect(h.read).not.toHaveBeenCalled();
});
it('cancels stale reads on host changes, protection and disposal', async () => {
  const h = harness();
  h.intake.start([FILE]);
  h.intake.configure({ ...h.host, disabled: true });
  await flush();
  expect(h.tasks[0]?.cancel).toHaveBeenCalledExactlyOnceWith();
  h.intake.start([FILE]);
  expect(h.read).toHaveBeenCalledTimes(1);
  h.intake.configure({ ...h.host, readOnly: true });
  h.intake.start([FILE]);
  expect(h.read).toHaveBeenCalledTimes(1);
  h.intake.configure(h.host);
  h.intake.start([FILE]);
  h.intake.start([FILE]);
  await flush();
  h.tasks[1]?.resolve('SGVsbG8=');
  await flush();
  expect(h.onValueChange).not.toHaveBeenCalled();
  h.intake.cancel();
  h.intake.cancel();
  await flush();
  expect(h.intake.getSnapshot().status).toBe('cancelled');
  h.intake.start([FILE]);
  h.intake.dispose();
  await flush();
  expect(h.onValueChange).not.toHaveBeenCalled();
});
it('rejects failures and mismatched bytes without partial writes', async () => {
  const h = harness();
  h.intake.start([FILE, FILE]);
  h.tasks[0]?.resolve('SGVsbG8=');
  await flush();
  h.tasks[1]?.reject();
  await flush();
  expect(h.intake.getSnapshot().status).toBe('error');
  expect(h.onValueChange).not.toHaveBeenCalled();
  h.intake.start([FILE]);
  h.tasks[2]?.resolve('bad');
  await flush();
  expect(h.intake.getSnapshot().status).toBe('error');
  expect(h.onValueChange).not.toHaveBeenCalled();
});
it('preserves equivalent host payloads and invalidates changes', async () => {
  const h = harness();
  h.intake.start([FILE]);
  h.intake.configure({ ...h.host, value: [] });
  h.tasks[0]?.resolve('SGVsbG8=');
  await flush();
  expect(h.onValueChange).toHaveBeenCalledTimes(1);
  const saved = h.onValueChange.mock.calls[0]?.[0];
  if (!saved) throw new Error('No files');
  h.intake.configure({ ...h.host, value: saved });
  h.intake.start([FILE]);
  h.intake.configure({
    ...h.host,
    value: saved.map((file) => ({
      ...file,
      content: { encoding: 'base64', data: 'aGVsbG8=' },
    })),
  });
  await flush();
  expect(h.onValueChange).toHaveBeenCalledTimes(1);
  h.intake.configure({ ...h.host, multiple: false });
  h.intake.start([FILE]);
  h.tasks[2]?.resolve('SGVsbG8=');
  await flush();
  expect(h.onValueChange.mock.calls[1]?.[0]).toHaveLength(1);
});
it('rejects exhausted IDs and stale successful completions', async () => {
  const read = vi.fn((): ReadTask => ({
    promise: Promise.resolve('SGVsbG8='),
    cancel: vi.fn(),
  }));
  const changed = vi.fn();
  const intake = new FileIntake({ read, id: () => 'fixed' });
  intake.start([FILE]);
  expect(read).not.toHaveBeenCalled();
  intake.configure({ value: [], onValueChange: changed });
  intake.start([FILE, FILE]);
  await flush();
  expect(intake.getSnapshot().status).toBe('error');
  expect(changed).not.toHaveBeenCalled();
  intake.start([FILE]);
  intake.dispose();
  await flush();
  expect(changed).not.toHaveBeenCalled();
});
it('clears obsolete intake feedback after host settings change', () => {
  const h = harness();
  h.intake.configure({ ...h.host, accept: 'images' });
  h.intake.start([FILE]);
  expect(h.intake.getSnapshot().status).toBe('error');
  h.intake.configure({ ...h.host, accept: 'all' });
  expect(h.intake.getSnapshot().status).toBe('idle');
});
