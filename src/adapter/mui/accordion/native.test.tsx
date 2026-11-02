import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiAccordion } from './accordion.adapter.js';
it('uses Material Accordion with controlled multiple disclosure', async () => {
  const change = vi.fn<(value: readonly string[]) => void>();
  render(
    <MuiAccordion
      label="FAQ"
      mode="multiple"
      value={['one']}
      onValueChange={change}
      items={[
        { value: 'one', label: 'First', content: <Typography>One</Typography> },
        { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
      ]}
    />,
  );
  const summary = screen.getByRole('button', { name: 'Second' });
  expect(summary.closest('.MuiAccordion-root')).not.toBeNull();
  await userEvent.click(summary);
  expect(change).toHaveBeenCalledWith(['one', 'two']);
});

it('preserves controlled noncollapsible disclosure behavior', async () => {
  const change = vi.fn<(value: readonly string[]) => void>();
  const items = [
    { value: 'one', label: 'First', content: <Typography>One</Typography> },
    { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
  ];
  const view = render(
    <MuiAccordion
      label="FAQ"
      value={['one']}
      items={items}
      collapsible={false}
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(change).toHaveBeenCalledWith(['two']);
  view.rerender(
    <MuiAccordion
      label="FAQ"
      value={['one']}
      items={items}
      retainContent
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(change).toHaveBeenLastCalledWith([]);
});
