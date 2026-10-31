import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundCheckboxGroup } from './bound-checkbox-group.js';
import { createDocumentState } from './create-document-state.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'choices', kind: 'selection', initial: [], access: 'readWrite' }],
  root: {
    type: 'CheckboxGroup',
    label: 'Generated checks',
    max: 2,
    items: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ],
    value: { state: 'choices', mode: 'readWrite' },
  },
});
describe('generative CheckboxGroup', () => {
  it('allows explicit host refresh of disabled selected choices', async () => {
    const user = userEvent.setup();
    if (document.root.type !== 'CheckboxGroup')
      throw new Error('Expected CheckboxGroup');
    const declaration = {
      ...document,
      root: {
        ...document.root,
        items: document.root.items.map((item) => ({
          ...item,
          disabled: true,
        })),
      },
    };
    const registry = createDocumentState(declaration);
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={declaration}
        registry={registry}
      />,
    );
    act(() => {
      expect(registry.update('choices', ['one']).success).toBe(true);
    });
    const choice = screen.getByRole('checkbox', { name: 'One' });
    expect(choice).toHaveAttribute('aria-checked', 'true');
    await user.click(choice);
    expect(success(registry.read('choices')).value).toEqual(['one']);
    act(() => {
      expect(registry.update('choices', []).success).toBe(true);
    });
    expect(choice).toHaveAttribute('aria-checked', 'false');
  });
  it('shares selection and applies all active limits to host writes', async () => {
    const user = userEvent.setup();
    if (document.root.type !== 'CheckboxGroup')
      throw new Error('Expected CheckboxGroup');
    const registry = createDocumentState(document);
    render(
      <GenerativeUI
        adapter={shadcnAdapter}
        registry={registry}
        document={{
          ...document,
          root: {
            type: 'VStack',
            children: [
              document.root,
              { ...structuredClone(document.root), label: 'Shared checks', max: 1 },
            ],
          },
        }}
      />,
    );
    await user.click(
      within(screen.getByRole('group', { name: 'Generated checks' })).getByRole(
        'checkbox',
        { name: 'One' },
      ),
    );
    expect(success(registry.read('choices')).value).toEqual(['one']);
    expect(
      within(screen.getByRole('group', { name: 'Shared checks' })).getByRole(
        'checkbox',
        { name: 'One' },
      ),
    ).toHaveAttribute('aria-checked', 'true');
    act(() => {
      expect(registry.update('choices', ['one', 'two']).success).toBe(false);
      expect(registry.update('choices', ['missing']).success).toBe(false);
    });
    expect(success(registry.read('choices')).value).toEqual(['one']);
    act(() => {
      expect(registry.update('choices', ['two']).success).toBe(true);
    });
    expect(
      within(screen.getByRole('group', { name: 'Shared checks' })).getByRole(
        'checkbox',
        { name: 'Two' },
      ),
    ).toHaveAttribute('aria-checked', 'true');
  });
  it('rejects invalid values, permissions, and missing live bindings', () => {
    for (const state of [
      [],
      [
        {
          key: 'choices',
          kind: 'selection',
          initial: ['missing'],
          access: 'readWrite',
        },
      ],
      [{ key: 'choices', kind: 'selection', initial: [], access: 'read' }],
      [{ key: 'choices', kind: 'text', initial: '', access: 'readWrite' }],
    ])
      expect(validateGenerativeDocument({ ...document, state }).success).toBe(false);
    if (document.root.type !== 'CheckboxGroup')
      throw new Error('Expected CheckboxGroup');
    render(
      <BoundCheckboxGroup
        node={document.root}
        registry={success(createStateRegistry([]))}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
});
