import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, expectTypeOf, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { FileUpload } from './file-upload.js';
import type { FileUploadProps } from './file-upload.props.js';
import { RenderContext } from '../shared/port.js';
import { fileUploadSchema } from '../../schema/file-upload/index.js';
import { renderEntry } from '../../renderer/contracts/render-entry.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
const entry = renderEntry('FileUpload', fileUploadSchema, ({ label }) => label);
const port = {
  render: (_name: string, props: unknown): ReactNode => entry.render(props),
  report: (issues: { path: string; message: string }[]): ReactNode => (
    <Issues issues={issues} />
  ),
};
it('provides a named closed component boundary and deterministic hydrated SSR', () => {
  expectTypeOf<FileUploadProps>().not.toHaveProperty('style');
  expectTypeOf<FileUploadProps>().not.toHaveProperty('className');
  expectTypeOf<FileUploadProps>().not.toHaveProperty('children');
  const changed = vi.fn();
  const tree = (
    <RenderContext.Provider value={port}>
      <FileUpload label="Payload" value={[]} onValueChange={changed} />
    </RenderContext.Provider>
  );
  const html = renderToString(tree);
  expect(changed).not.toHaveBeenCalled();
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByText('Payload')).toBeVisible();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
  expect(renderToString(tree)).toBe(html);
});
it('reports invalid application declarations before rendering native chooser', () => {
  render(
    <RenderContext.Provider value={port}>
      <FileUpload
        label="Payload"
        value={[]}
        onValueChange={() => undefined}
        maxFiles={0}
      />
    </RenderContext.Provider>,
  );
  expect(screen.getByRole('alert')).toBeVisible();
});
