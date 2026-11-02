import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnAccordion } from './accordion.adapter.js';

it('maps single and multiple controlled selection to SDK accordion APIs', async () => {
  const change = vi.fn();
  const items = [{ value: 'one', label: 'One', content: 'First content' }];
  const view = render(
    <ShadcnAccordion label="Details" items={items} value={[]} onValueChange={change} />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'One' }));
  expect(change).toHaveBeenCalledWith(['one']);
  view.rerender(
    <ShadcnAccordion
      label="Details"
      items={items}
      value={['one']}
      onValueChange={change}
      retainContent
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'One' }));
  expect(change).toHaveBeenCalledWith([]);
  view.rerender(
    <ShadcnAccordion
      label="Details"
      items={items}
      value={[]}
      onValueChange={change}
      mode="multiple"
      retainContent
    />,
  );
  expect(screen.getByText('First content')).not.toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'One' }));
  expect(change).toHaveBeenLastCalledWith(['one']);
});
