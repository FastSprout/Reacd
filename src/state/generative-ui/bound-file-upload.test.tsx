import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, it } from 'vitest';
import { BoundFileUpload } from './bound-file-upload.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { RenderContext } from '../../components/shared/port.js';
import { fileUploadSchema } from '../../schema/file-upload/index.js';
import { declarationProbe } from '../../../test-support/declaration-probe.js';
import { fileUploadNodeSchema } from '../../schema/file-upload/generative.schema.js';
import { success } from '../../../test-support/data-table.js';
const FILE = {
  id: 'saved',
  name: 'saved.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
const reference = { state: 'files', mode: 'readWrite' } as const;
const node = { type: 'FileUpload', label: 'Writer', value: reference } as const;
const probe = declarationProbe(fileUploadSchema);
function Surface({ children }: { children: ReactNode }) {
  return <RenderContext.Provider value={probe.port}>{children}</RenderContext.Provider>;
}
it('shares real payloads and leases cardinality constraints', () => {
  const registry = success(
    createStateRegistry([
      { key: 'files', kind: 'fileList', initial: [FILE], access: 'readWrite' },
    ]),
  );
  const view = render(
    <Surface>
      <BoundFileUpload node={{ ...node, multiple: false }} registry={registry} />
      <BoundFileUpload
        node={{
          ...node,
          label: 'Reader',
          value: {
            ...reference,
            mode: 'read',
          },
        }}
        registry={registry}
      />
    </Surface>,
  );
  expect(probe.read('Reader').readOnly).toBe(true);
  act(() => probe.read('Writer').onValueChange([]));
  expect(success(registry.read('files')).value).toEqual([]);
  expect(probe.read('Reader').value).toEqual([]);
  act(() => {
    expect(registry.update('files', [FILE, { ...FILE, id: 'second' }]).success).toBe(
      false,
    );
  });
  view.unmount();
  expect(registry.update('files', [FILE, { ...FILE, id: 'second' }]).success).toBe(
    true,
  );
  const isolated = success(
    createStateRegistry([
      { key: 'files', kind: 'fileList', initial: [], access: 'readWrite' },
    ]),
  );
  expect(success(isolated.read('files')).value).toEqual([]);
});
it('rejects unknown, wrong-kind, invalid-value and ungranted writer bindings', () => {
  for (const definitions of [
    [],
    [{ key: 'files', kind: 'text', initial: '', access: 'readWrite' }],
    [{ key: 'files', kind: 'fileList', initial: [FILE], access: 'read' }],
  ]) {
    const registry = success(createStateRegistry(definitions));
    const view = render(
      <Surface>
        <BoundFileUpload node={node} registry={registry} />
      </Surface>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    view.unmount();
  }
  const registry = success(
    createStateRegistry([
      { key: 'files', kind: 'fileList', initial: [FILE], access: 'readWrite' },
    ]),
  );
  render(
    <Surface>
      <BoundFileUpload node={{ ...node, accept: 'pdf' }} registry={registry} />
    </Surface>,
  );
  expect(screen.getByRole('alert')).toBeVisible();
});
it('validates transport without literal files or raw callbacks', () => {
  expect(fileUploadNodeSchema.safeParse(node).success).toBe(true);
  expect(fileUploadNodeSchema.safeParse({ ...node, multiple: false }).success).toBe(
    true,
  );
  expect(
    fileUploadNodeSchema.safeParse({ ...node, multiple: false, maxFiles: 1 }).success,
  ).toBe(true);
  for (const invalid of [
    { ...node, multiple: false, maxFiles: 2 },
    { ...node, value: [FILE] },
    { ...node, onValueChange: () => undefined },
    { ...node, className: 'custom' },
  ])
    expect(fileUploadNodeSchema.safeParse(invalid).success).toBe(false);
});
