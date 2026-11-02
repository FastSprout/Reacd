import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnCheckboxGroup } from './checkbox-group.adapter.js';

it('composes bounded multiple choices from SDK checkboxes', async () => {
  const change = vi.fn();
  const items = [
    { value: 'one', label: 'One', description: 'First option' },
    { value: 'two', label: 'Two' },
  ];
  const view = render(
    <ShadcnCheckboxGroup
      label="Choices"
      items={items}
      value={[]}
      onValueChange={change}
      description="Pick options"
      required
    />,
  );
  await userEvent.click(screen.getByRole('checkbox', { name: 'One' }));
  expect(change).toHaveBeenCalledWith(['one']);
  view.rerender(
    <ShadcnCheckboxGroup
      label="Choices"
      items={items}
      value={['one']}
      onValueChange={change}
      max={1}
      orientation="horizontal"
    />,
  );
  expect(screen.getByRole('checkbox', { name: 'Two' })).toBeDisabled();
  await userEvent.click(screen.getByRole('checkbox', { name: 'One' }));
  expect(change).toHaveBeenCalledWith([]);
});
