import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { FormControls } from '../../../../test-support/form-controls.js';
import { FormField } from '../../../components/form-field/index.js';
import { Switch } from '../../../components/switch/index.js';
import { Textarea } from '../../../components/textarea/index.js';

it('hydrates stable label/error IDs and canonical values', () => {
  const errors: unknown[] = [];
  const ui = (
    <FormControls>
      <form>
        <FormField
          name="notes"
          label="Review"
          error="Review pending"
          description="Owner notes"
        >
          <Textarea label="Notes" value="Reviewed" onValueChange={vi.fn()} autoResize />
        </FormField>
        <Switch label="Approved" checked onCheckedChange={vi.fn()} name="approved" />
      </form>
    </FormControls>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  try {
    const id = container.querySelector('textarea')?.id;
    render(ui, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(screen.getByRole('textbox', { name: 'Notes' }).id).toBe(id);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Owner notes Review pending',
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('Missing form');
    expect([...new FormData(form)]).toEqual([
      ['notes', 'Reviewed'],
      ['approved', 'on'],
    ]);
    expect(errors).toEqual([]);
  } finally {
    container.remove();
  }
});
