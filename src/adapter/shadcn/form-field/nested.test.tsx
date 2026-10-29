import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnFormField } from './form-field.adapter.js';
import { ShadcnTextarea } from '../textarea/textarea.adapter.js';
import { ShadcnSwitch } from '../switch/switch.adapter.js';

it('preserves nested errors and nearest names with native labels', () => {
  render(
    <ShadcnFormField
      name="outer"
      required
      description="Outer guidance"
      error="Outer error"
    >
      <ShadcnFormField name="inner" label="Inner group" description="Inner guidance">
        <ShadcnTextarea label="Notes" value="Draft" onValueChange={vi.fn()} />
        <ShadcnSwitch
          label="Opt-in"
          checked={false}
          required={false}
          onCheckedChange={vi.fn()}
        />
      </ShadcnFormField>
    </ShadcnFormField>,
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
