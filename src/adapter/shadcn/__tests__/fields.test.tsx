import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  Checkbox,
  CodeEditor,
  Form,
  Input,
  ReacdProvider,
  Select,
  Slider,
  SubmitButton,
  TextArea,
  Toggle,
} from '../../../index.js';
import { jsx } from '../../../jsx-runtime.js';
import { OPTIONS } from './examples.js';

let restoreLayout: () => void;
beforeEach(() => {
  restoreLayout = installLayout();
});
afterEach(() => restoreLayout());

describe('field behavior', () => {
  it('reports typed text changes and supports custom text-area rows', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <TextArea label="Description" value="" rows={6} onValueChange={change} />
        <CodeEditor label="Source" value="" onValueChange={change} />
      </ReacdProvider>,
    );
    expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '6');
    await user.type(screen.getByLabelText('Description'), 'A');
    await user.type(screen.getByLabelText('Source'), 'B');
    expect(change).toHaveBeenCalledWith('A');
    expect(change).toHaveBeenCalledWith('B');
  });

  it('toggles boolean controls using their visible labels', async () => {
    const user = userEvent.setup();
    const checkbox = vi.fn();
    const toggle = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Checkbox label="Consent" checked={false} onCheckedChange={checkbox} />
        <Toggle label="Updates" checked={false} onCheckedChange={toggle} />
      </ReacdProvider>,
    );
    await user.click(screen.getByText('Consent'));
    await user.click(screen.getByText('Updates'));
    expect(checkbox).toHaveBeenCalledWith(true);
    expect(toggle).toHaveBeenCalledWith(true);
  });

  it('preserves native required-field validation and form submission', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    function Example() {
      const [value, setValue] = useState('');
      return (
        <ReacdProvider adapter={shadcnAdapter}>
          <Form label="Profile" onSubmit={submit}>
            <Input label="Name" value={value} required onValueChange={setValue} />
            <SubmitButton label="Save" intent="secondary" />
            <SubmitButton label="Delete" intent="danger" disabled />
          </Form>
        </ReacdProvider>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Name'), 'Example');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(submit).toHaveBeenCalledOnce();
  });

  it('changes slider values from the keyboard', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Slider
          label="Volume"
          value={50}
          min={0}
          max={100}
          step={10}
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    const slider = await screen.findByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(change).toHaveBeenCalledWith(60);
  });

  it.each([
    jsx(Checkbox, { label: 'Consent', checked: false, onCheckedChange: 'bad' }),
    jsx(Slider, { label: 'Range', value: 1, min: 0, max: 2, onValueChange: 'bad' }),
    jsx(Slider, { label: 'Range', value: 1, min: 2, max: 0, onValueChange() {} }),
    jsx(Slider, { label: 'Range', value: -1, min: 0, max: 2, onValueChange() {} }),
    jsx(Slider, { label: 'Range', value: 3, min: 0, max: 2, onValueChange() {} }),
    jsx(Select, {
      label: 'Choice',
      value: 'missing',
      items: OPTIONS,
      onValueChange() {},
    }),
    jsx(Select, {
      label: 'Choice',
      value: 'a',
      items: [OPTIONS[0], OPTIONS[0]],
      onValueChange() {},
    }),
  ])('rejects invalid field properties', (view) => {
    render(<ReacdProvider adapter={shadcnAdapter}>{view}</ReacdProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to render this interface.',
    );
  });
});
