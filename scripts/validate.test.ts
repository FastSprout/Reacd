import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { read } = vi.hoisted(() => ({
  read: vi.fn<(path: string, encoding: string) => string>(),
}));
vi.mock('node:fs', () => ({ readFileSync: read }));
const originalArguments = process.argv;
const originalExitCode = process.exitCode;
beforeEach(() => {
  vi.resetModules();
  read.mockReset();
  process.argv = ['node', 'validate.ts', 'document.json'];
  process.exitCode = undefined;
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  process.argv = originalArguments;
  process.exitCode = originalExitCode;
  vi.restoreAllMocks();
});
describe('validation CLI', () => {
  it('requires a filename before attempting any read', async () => {
    process.argv = ['node', 'validate.ts'];
    await expect(import('./validate.js')).rejects.toThrow(
      'Usage: npm run validate -- test-support/fixtures/generative/standard.json',
    );
    expect(read).not.toHaveBeenCalled();
  });
  it('reports a valid document without a failing exit code', async () => {
    read.mockReturnValue(
      JSON.stringify({
        schemaVersion: '0.1',
        templateId: 'saas-modern-light',
        root: { type: 'Text', content: 'Valid' },
      }),
    );
    await import('./validate.js');
    expect(read).toHaveBeenCalledExactlyOnceWith('document.json', 'utf8');
    expect(console.log).toHaveBeenCalledWith(
      'The reacd 0.1 document is structurally and semantically valid.',
    );
    expect(console.error).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });
  it('reports a property diagnostic and fails invalid documents', async () => {
    read.mockReturnValue(
      JSON.stringify({
        schemaVersion: '0.1',
        templateId: 'saas-modern-light',
        root: { type: 'Text', content: 1 },
      }),
    );
    await import('./validate.js');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/^\$\.root\.content:/),
    );
    expect(console.log).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
  it('reports malformed JSON and propagates file read failures', async () => {
    read.mockReturnValue('{');
    await import('./validate.js');
    expect(process.exitCode).toBe(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/^\$:/));
    vi.resetModules();
    const failure = new Error('Missing file.');
    read.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./validate.js')).rejects.toBe(failure);
  });
});
