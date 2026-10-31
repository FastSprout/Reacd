import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';
import type { EditorProps } from '../../components/editor/index.js';
import type { EditorDocument } from '../../core/editor-document.js';
import { Text } from '../../components/text/index.js';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundEditor } from './bound-editor.js';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Draft' }] },
  ],
};
const NEXT: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Edited' }] },
  ],
};
const INVALID: EditorDocument = { version: 1, blocks: [] };
type PrivateEditorProps = Extract<EditorProps, { onValueChange: unknown }>;
const records = vi.hoisted((): PrivateEditorProps[] => []);
vi.mock('../../components/editor/index.js', () => ({
  Editor: (properties: PrivateEditorProps) => {
    records.push(properties);
    return (
      <section aria-label={properties.label}>
        <output>{JSON.stringify(properties.value)}</output>
        {properties.toolbar}
        {properties.children}
        <button type="button" onClick={() => properties.onValueChange(NEXT)}>
          Propose {properties.label}
        </button>
        <button type="button" onClick={() => properties.onValueChange(INVALID)}>
          Invalid {properties.label}
        </button>
      </section>
    );
  },
}));
const node = {
  type: 'Editor',
  label: 'Writer',
  value: { state: 'document', mode: 'readWrite' },
} as const;
function registry() {
  return success(
    createStateRegistry([
      { key: 'document', kind: 'richDocument', initial: INITIAL, access: 'readWrite' },
    ]),
  );
}
beforeEach(() => {
  records.length = 0;
});

it('projects exact rich documents and rendered slots without store leakage', () => {
  const first = registry();
  const other = registry();
  const declaration = {
    ...node,
    description: 'Guidance',
    placeholder: 'Write a draft',
    toolbar: [{ type: 'EditorToolbar' }],
    children: [{ type: 'Text', content: 'Unrendered transport node' }],
  };
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundEditor
        node={declaration}
        registry={first}
        toolbar={<Text>Toolbar projection</Text>}
      >
        <Text>Auxiliary projection</Text>
      </BoundEditor>
      <BoundEditor
        node={{ ...node, label: 'Reader', value: { state: 'document', mode: 'read' } }}
        registry={first}
      />
    </ReacdProvider>,
  );
  expect(screen.getByText('Toolbar projection')).toBeVisible();
  expect(screen.getByText('Auxiliary projection')).toBeVisible();
  act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'Propose Writer' }));
  });
  expect(success(first.read('document')).value).toEqual(NEXT);
  expect(success(other.read('document')).value).toEqual(INITIAL);
  expect(records.filter((record) => record.label === 'Reader').at(-1)?.value).toEqual(
    NEXT,
  );
  expect(records.filter((record) => record.label === 'Reader').at(-1)?.readOnly).toBe(
    true,
  );
  act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'Invalid Writer' }));
  });
  expect(success(first.read('document')).value).toEqual(NEXT);
  act(() => {
    expect(first.update('document', INITIAL).success).toBe(true);
  });
  expect(records.filter((record) => record.label === 'Writer').at(-1)?.value).toEqual(
    INITIAL,
  );
  expect(
    records.filter((record) => record.label === 'Writer').at(-1),
  ).not.toHaveProperty('selection');
});

it('prevents read bindings and literal protected views from writing', () => {
  const state = registry();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundEditor
        node={{
          ...node,
          label: 'Read binding',
          readOnly: false,
          value: { state: 'document', mode: 'read' },
        }}
        registry={state}
      />
      <BoundEditor
        node={{ ...node, label: 'Literal', readOnly: true }}
        registry={state}
      />
      <BoundEditor
        node={{ ...node, label: 'Disabled', disabled: true }}
        registry={state}
      />
    </ReacdProvider>,
  );
  for (const label of ['Read binding', 'Literal', 'Disabled'])
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: `Propose ${label}` }));
    });
  expect(success(state.read('document')).value).toEqual(INITIAL);
  expect(records.find((record) => record.label === 'Read binding')?.readOnly).toBe(
    true,
  );
  expect(records.find((record) => record.label === 'Disabled')?.disabled).toBe(true);
});

it('reports missing or wrong-kind references before rendering Editor', () => {
  const state = success(
    createStateRegistry([
      { key: 'text', kind: 'text', initial: 'Raw', access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundEditor node={node} registry={state} />
      <BoundEditor
        node={{ ...node, value: { state: 'text', mode: 'readWrite' } }}
        registry={state}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(records).toEqual([]);
});

it('server-projects independent documents without publishing state writes', () => {
  const first = registry();
  const other = registry();
  expect(first.update('document', NEXT).success).toBe(true);
  const notify = vi.fn();
  const unsubscribe = success(first.subscribe('document', notify));
  try {
    const firstMarkup = renderToString(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundEditor node={node} registry={first} />
      </ReacdProvider>,
    );
    const otherMarkup = renderToString(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundEditor node={node} registry={other} />
      </ReacdProvider>,
    );
    expect(firstMarkup).toContain('Edited');
    expect(otherMarkup).toContain('Draft');
    expect(notify).not.toHaveBeenCalled();
    expect(success(first.read('document')).value).toEqual(NEXT);
    expect(success(other.read('document')).value).toEqual(INITIAL);
  } finally {
    unsubscribe();
  }
});
