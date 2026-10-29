import { render, screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { FormControls } from '../../../test-support/form-controls.js';
import { Switch } from '../switch/index.js';
import type { SwitchProps } from '../switch/index.js';
import { Textarea } from '../textarea/index.js';
import type { TextareaProps } from '../textarea/index.js';
import { FormField } from './index.js';
import type { FormFieldProps } from './index.js';

describe('named form declarations', () => {
  it('renders closed declarations through the trusted catalog', () => {
    render(
      <FormControls>
        <FormField name="account" label="Account">
          <Switch label="Publish" checked={false} onCheckedChange={vi.fn()} />
          <Textarea label="Notes" value="Draft" onValueChange={vi.fn()} />
        </FormField>
      </FormControls>,
    );
    expect(screen.getByRole('group', { name: 'Account' })).toBeVisible();
    expect(screen.getByRole('switch', { name: 'Publish' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('Draft');
    expectTypeOf<'style'>().not.toExtend<keyof SwitchProps>();
    expectTypeOf<'className'>().not.toExtend<keyof TextareaProps>();
    expectTypeOf<'onClick'>().not.toExtend<keyof FormFieldProps>();
  });

  it('reports invalid logical props before rendering the adapter', () => {
    render(
      <FormControls>
        <Switch label="" checked onCheckedChange={vi.fn()} />
        <Textarea label="" value="" onValueChange={vi.fn()} />
        <FormField name="">{null}</FormField>
      </FormControls>,
    );
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.queryByRole('switch')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('group')).toBeNull();
  });
});
