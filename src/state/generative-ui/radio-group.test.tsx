import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { BoundRadioGroup } from './bound-radio-group.js';
import { createDocumentState } from './create-document-state.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [{ key: 'choice', kind: 'text', initial: '', access: 'readWrite' }],
  root: {
    type: 'RadioGroup',
    label: 'Generated radio',
    items: [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', disabled: true },
    ],
    value: { state: 'choice', mode: 'readWrite' },
  },
});
describe('generative RadioGroup', () => {
  it('shares text state and rejects unknown host selections', async () => {
    const user = userEvent.setup();
    if (document.root.type !== 'RadioGroup') throw new Error('Expected RadioGroup');
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
              { ...structuredClone(document.root), label: 'Shared radio' },
              { type: 'Text', content: { state: 'choice', mode: 'read' } },
            ],
          },
        }}
      />,
    );
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Generated radio' })).getByRole(
        'radio',
        { name: 'One' },
      ),
    );
    expect(success(registry.read('choice')).value).toBe('one');
    expect(screen.getByText('one', { exact: true })).toBeVisible();
    expect(
      within(screen.getByRole('radiogroup', { name: 'Shared radio' })).getByRole(
        'radio',
        { name: 'One' },
      ),
    ).toHaveAttribute('aria-checked', 'true');
    act(() => {
      expect(registry.update('choice', 'missing').success).toBe(false);
    });
    expect(success(registry.read('choice')).value).toBe('one');
    act(() => {
      expect(registry.update('choice', 'two').success).toBe(true);
    });
    expect(screen.getByText('two', { exact: true })).toBeVisible();
    for (const choice of screen.getAllByRole('radio', { name: 'Two' })) {
      expect(choice).toHaveAttribute('aria-checked', 'true');
      expect(choice).toHaveAttribute('aria-disabled', 'true');
    }
  });
  it('rejects incompatible and read-only definitions and missing live bindings', () => {
    for (const state of [
      [],
      [{ key: 'choice', kind: 'text', initial: 'unknown', access: 'readWrite' }],
      [{ key: 'choice', kind: 'text', initial: '', access: 'read' }],
      [{ key: 'choice', kind: 'boolean', initial: false, access: 'readWrite' }],
    ])
      expect(validateGenerativeDocument({ ...document, state }).success).toBe(false);
    if (document.root.type !== 'RadioGroup') throw new Error('Expected RadioGroup');
    render(
      <BoundRadioGroup
        node={document.root}
        registry={success(createStateRegistry([]))}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  });
});
