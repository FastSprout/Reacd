import { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { EDITOR_MENU_POLICY } from '../../../core/editor-menu-policy.js';
import { ShadcnEditor } from '../editor/editor.adapter.js';
import * as Mention from '../editor-mention-menu/editor-mention-menu.adapter.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());
interface HostProps {
  readonly label: string;
  readonly person: string;
  readonly duplicate?: boolean;
  readonly readOnly?: boolean;
  readonly disabled?: boolean;
}
function Host({ label, person, duplicate, readOnly, disabled }: HostProps) {
  const [value, setValue] = useState(() =>
    editorDocumentSchema.parse({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
    }),
  );
  return (
    <ShadcnEditor
      label={label}
      value={value}
      onValueChange={setValue}
      readOnly={readOnly}
      disabled={disabled}
    >
      <Mention.ShadcnEditorMentionMenu
        label={`${label} people`}
        items={[{ id: 'person', label: person }]}
      />
      {duplicate && (
        <Mention.ShadcnEditorMentionMenu
          label="Duplicate people"
          items={[{ id: 'second', label: 'Other' }]}
        />
      )}
    </ShadcnEditor>
  );
}

it('reports orphan menus without exposing dead options', () => {
  render(<Mention.ShadcnEditorMentionMenu label="Orphan" items={[]} />);
  expect(screen.getByRole('alert')).toHaveTextContent(EDITOR_MENU_POLICY.scopeError);
  expect(screen.queryByRole('listbox')).toBeNull();
});

it('reports duplicate triggers and recovers after the duplicate unmounts', async () => {
  const user = userEvent.setup();
  const view = render(<Host label="Notes" person="First person" duplicate />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(
      EDITOR_MENU_POLICY.duplicateError,
    ),
  );
  view.rerender(<Host label="Notes" person="Replacement person" />);
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  box.focus();
  await user.keyboard('@');
  expect(
    await screen.findByRole('option', { name: 'Replacement person' }),
  ).toBeVisible();
  expect(screen.queryByRole('option', { name: 'First person' })).toBeNull();
});

it('keeps independent editor menus and chosen values in their own scopes', async () => {
  const user = userEvent.setup();
  const view = render(
    <>
      <Host key="first" label="First" person="Alpha" />
      <Host key="second" label="Second" person="Beta" />
    </>,
  );
  const first = await screen.findByRole('textbox', { name: 'First' });
  const second = await screen.findByRole('textbox', { name: 'Second' });
  first.focus();
  await user.keyboard('@');
  expect(await screen.findByRole('listbox', { name: 'First people' })).toBeVisible();
  second.focus();
  await user.keyboard('@');
  const list = await screen.findByRole('listbox', { name: 'Second people' });
  await user.click(within(list).getByRole('option', { name: 'Beta' }));
  await waitFor(() => expect(second.textContent).toBe('@Beta '));
  expect(first.textContent).toBe('@');
  view.rerender(
    <>
      <Host key="second" label="Second" person="Beta" />
    </>,
  );
  expect(screen.getByRole('textbox', { name: 'Second' }).textContent).toBe('@Beta ');
  expect(screen.queryByRole('alert')).toBeNull();
});

it.each([{ readOnly: true }, { disabled: true }])(
  'does not register or activate a protected menu: %j',
  async (flags) => {
    const user = userEvent.setup();
    render(<Host label="Protected" person="Person" {...flags} />);
    const box = await screen.findByRole('textbox', { name: 'Protected' });
    box.focus();
    await user.keyboard('@');
    fireEvent.paste(box, { clipboardData: { getData: () => '@' } });
    expect(box.textContent).toBe('');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(box).not.toHaveAttribute('aria-controls');
  },
);
