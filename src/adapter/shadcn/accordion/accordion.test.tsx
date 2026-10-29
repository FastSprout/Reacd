import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, Collapsible, ReacdProvider, Select, Text } from '../../../index.js';
import type { AccordionProps } from '../../../index.js';

function Example(properties: Partial<AccordionProps>) {
  const [value, setValue] = useState<readonly string[]>(['one']);
  return (
    <ReacdProvider>
      <Accordion
        label="Sections"
        value={value}
        onValueChange={setValue}
        items={[
          { value: 'one', label: 'One', content: <Text>First body</Text> },
          { value: 'two', label: 'Two', content: <Text>Second body</Text> },
          {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
            content: <Text>Disabled body</Text>,
          },
        ]}
        {...properties}
      />
    </ReacdProvider>
  );
}
describe('shadcn Accordion', () => {
  it('closes child portals when a retained section closes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Host({
      value,
      active = true,
    }: {
      value: readonly string[];
      active?: boolean;
    }) {
      return (
        <ReacdProvider>
          <Collapsible
            label="Ancestor"
            open={active}
            onOpenChange={change}
            retainContent
            showTrigger={false}
          >
            <Accordion
              label="Menu sections"
              value={value}
              onValueChange={change}
              retainContent
              items={[
                {
                  value: 'details',
                  label: 'Details',
                  content: (
                    <Select
                      label="Section role"
                      value="a"
                      onValueChange={change}
                      items={[{ value: 'a', label: 'Reader' }]}
                    />
                  ),
                },
              ]}
            />
          </Collapsible>
        </ReacdProvider>
      );
    }
    const view = render(<Host value={['details']} />);
    await user.click(screen.getByRole('combobox', { name: 'Section role' }));
    expect(await screen.findByRole('listbox')).toBeVisible();
    view.rerender(<Host value={[]} />);
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { hidden: true })).toBeNull(),
    );
    view.rerender(<Host value={['details']} />);
    expect(screen.getByRole('combobox', { name: 'Section role' })).toHaveTextContent(
      'Reader',
    );
    await user.click(screen.getByRole('combobox', { name: 'Section role' }));
    expect(await screen.findByRole('listbox')).toBeVisible();
    view.rerender(<Host value={['details']} active={false} />);
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { hidden: true })).toBeNull(),
    );
    expect(change).not.toHaveBeenCalled();
  });
  it('supports single expansion, collapse, disabled items, and focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.getByRole('group', { name: 'Sections' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(screen.queryByText('First body')).toBeNull();
    expect(screen.getByText('Second body')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(screen.queryByText('Second body')).toBeNull();
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    screen.getByRole('button', { name: 'One' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
    await user.keyboard('{Home}{Enter}');
    expect(screen.getByText('First body')).toBeInTheDocument();
  });
  it('retains hidden content and supports multiple expanded items', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example mode="multiple" retainContent />);
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(screen.getByText('First body')).toBeVisible();
    expect(screen.getByText('Second body')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByText('First body')).not.toBeVisible();
    rerender(<Example disabled />);
    expect(screen.getByRole('button', { name: 'One' })).toBeDisabled();
  });
  it('prevents collapsing a required single section', async () => {
    const user = userEvent.setup();
    render(<Example collapsible={false} />);
    await user.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByText('First body')).toBeVisible();
  });
});
