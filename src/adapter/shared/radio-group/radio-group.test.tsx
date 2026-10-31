import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, ReacdProvider, Button } from '../../../index.js';

const items = [
  { value: 'one', label: 'First choice', description: 'First description' },
  { value: 'two', label: 'Disabled choice', disabled: true },
  { value: 'three', label: 'Third choice' },
];
describe('shadcn RadioGroup', () => {
  it('labels choices and supports arrow selection, wrapping, and Space', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Scene() {
      const [value, setValue] = useState('');
      return (
        <ReacdProvider adapter={activeTestAdapter}>
          <RadioGroup
            label="Delivery"
            description="Choose one"
            items={items}
            value={value}
            onValueChange={(next) => {
              change(next);
              setValue(next);
            }}
          />
          <Button label="After group" onPress={change} />
        </ReacdProvider>
      );
    }
    render(<Scene />);
    expect(
      screen.getByRole('radiogroup', { name: 'Delivery' }),
    ).toHaveAccessibleDescription('Choose one');
    const first = screen.getByRole('radio', { name: 'First choice' });
    expect(first).toHaveAccessibleDescription('First description');
    await user.click(screen.getByText('First choice'));
    expect(change).toHaveBeenLastCalledWith('one');
    expect(first).toHaveAttribute('aria-checked', 'true');
    first.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Third choice' })).toHaveFocus();
    expect(change).toHaveBeenLastCalledWith('three');
    await user.keyboard('{ArrowDown} ');
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('aria-checked', 'true');
    await user.tab();
    expect(screen.getByRole('button', { name: 'After group' })).toHaveFocus();
  });
  it('supports rejected writes, horizontal layout, and disabling', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <RadioGroup
          label="Choice"
          items={items}
          value=""
          onValueChange={change}
          orientation="horizontal"
          name="delivery"
          required
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('radio', { name: 'Third choice' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('three');
    expect(screen.getByRole('radio', { name: 'Third choice' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <RadioGroup
          label="Choice"
          items={items}
          value="one"
          onValueChange={change}
          disabled
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('radio', { name: 'Third choice' }));
    expect(change).toHaveBeenCalledOnce();
    expect(screen.getByRole('radio', { name: 'Third choice' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
