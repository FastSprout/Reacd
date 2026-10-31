import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { SharedFormField } from './form-field.adapter.js';
import { SharedTextarea } from '../textarea/textarea.adapter.js';
import { SharedSwitch } from '../switch/switch.adapter.js';

it('preserves nested errors and nearest names with native labels', () => {
  render(
    <SharedFormField
      name="outer"
      required
      description="Outer guidance"
      error="Outer error"
    >
      <SharedFormField name="inner" label="Inner group" description="Inner guidance">
        <SharedTextarea label="Notes" value="Draft" onValueChange={vi.fn()} />
        <SharedSwitch
          label="Opt-in"
          checked={false}
          required={false}
          onCheckedChange={vi.fn()}
        />
      </SharedFormField>
    </SharedFormField>,
  );
  const textarea = screen.getByRole('textbox');
  expect(textarea).toHaveAttribute('name', 'inner');
  expect(textarea).toHaveAttribute('required');
  expect(textarea).toHaveAccessibleDescription(
    'Outer guidance Outer error Inner guidance',
  );
  expect(textarea).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('switch')).not.toHaveAttribute('aria-required');
  const ids = textarea.getAttribute('aria-describedby')?.split(' ');
  expect(new Set(ids).size).toBe(ids?.length);
  expect(screen.getByText('Notes')).toBeVisible();
});
