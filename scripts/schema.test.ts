import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { read, write } = vi.hoisted(() => ({
  read: vi.fn<(path: URL, encoding: string) => string>(),
  write: vi.fn<(path: URL, contents: string) => void>(),
}));
vi.mock('node:fs', () => ({ readFileSync: read, writeFileSync: write }));
const originalArguments = process.argv;
beforeEach(() => {
  vi.resetModules();
  read.mockReset();
  write.mockReset();
  process.argv = ['node', 'schema.ts'];
});
afterEach(() => {
  process.argv = originalArguments;
});

async function generatedFiles() {
  await import('./schema.js');
  const files = new Map(
    write.mock.calls.map(([path, content]) => [path.href, content]),
  );
  vi.resetModules();
  write.mockClear();
  process.argv.push('--check');
  return files;
}
describe('schema CLI', () => {
  it('generates both portable contracts with versioned IDs and newlines', async () => {
    await import('./schema.js');
    expect(read).not.toHaveBeenCalled();
    expect(write).toHaveBeenCalledTimes(2);
    for (const [path, contents] of write.mock.calls) {
      expect(contents.endsWith('\n')).toBe(true);
      const schema: unknown = JSON.parse(contents);
      expect(schema).toMatchObject({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: path.pathname.endsWith('/generative.schema.json')
          ? 'https://reacd.dev/schema/0.2.json'
          : 'https://reacd.dev/schema/0.1.json',
        type: 'object',
        additionalProperties: false,
      });
    }
  });
  it('checks freshness without writing either contract', async () => {
    const files = await generatedFiles();
    read.mockImplementation((path) => {
      const content = files.get(path.href);
      if (content === undefined) throw new Error('Unexpected schema path.');
      return content;
    });
    await import('./schema.js');
    expect(read).toHaveBeenCalledTimes(2);
    expect(write).not.toHaveBeenCalled();
  });
  it.each(['reacd.schema.json', 'generative.schema.json'])(
    'rejects stale %s without rewriting it',
    async (stale) => {
      const files = await generatedFiles();
      read.mockImplementation((path) => {
        if (path.pathname.endsWith(`/${stale}`)) return '{}';
        const content = files.get(path.href);
        if (content === undefined) throw new Error('Unexpected schema path.');
        return content;
      });
      await expect(import('./schema.js')).rejects.toThrow(`${stale} is stale.`);
      expect(write).not.toHaveBeenCalled();
    },
  );
  it('propagates read and write failures', async () => {
    const failure = new Error('Filesystem unavailable.');
    write.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./schema.js')).rejects.toBe(failure);
    vi.resetModules();
    write.mockClear();
    process.argv.push('--check');
    read.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./schema.js')).rejects.toBe(failure);
    expect(write).not.toHaveBeenCalled();
  });
});
