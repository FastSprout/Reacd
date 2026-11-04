import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiAccordion } from './accordion.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';

it('lets each summary control one uniquely identified native SDK region', () => {
  const view = render(
    <MuiAccordion
      label="FAQ"
      mode="multiple"
      value={['one', 'two']}
      retainContent
      onValueChange={vi.fn()}
      items={[
        { value: 'one', label: 'First', content: <Typography>One</Typography> },
        { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
      ]}
    />,
  );
  const targets = screen.getAllByRole('button').map((summary) => {
    const target = summary.getAttribute('aria-controls');
    if (!target) throw new Error('Missing native Accordion target.');
    const matches = [...view.container.querySelectorAll('[id]')]
      .filter((element) => element.id === target);
    expect(matches).toHaveLength(1);
    const region = matches[0];
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-labelledby', summary.id);
    expect(region?.classList.contains('MuiAccordion-region')).toBe(true);
    return target;
  });
  expect(new Set(targets).size).toBe(targets.length);
});

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

it('preserves other selections when a multiple item collapses', async () => {
  const change = vi.fn();
  render(
    <MuiAccordion
      label="FAQ"
      mode="multiple"
      value={['one', 'two']}
      onValueChange={change}
      items={[
        { value: 'one', label: 'First', content: <Typography>One</Typography> },
        { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
      ]}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(['two']);
});

it('keeps item and inactive-scope protection on native summaries', () => {
  const properties = {
    label: 'FAQ', value: ['one'], onValueChange: vi.fn(),
    items: [
      { value: 'one', label: 'First', content: 'One', disabled: true },
      { value: 'two', label: 'Second', content: 'Two' },
    ],
  };
  const view = render(<MuiAccordion {...properties} />);
  expect(screen.getByRole('button', { name: 'First' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Second' })).not.toBeDisabled();
  view.rerender(
    <PortalActiveContext value={false}>
      <MuiAccordion {...properties} />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Second' })).toBeDisabled();
  expect(properties.onValueChange).not.toHaveBeenCalled();
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
