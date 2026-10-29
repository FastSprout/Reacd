import { atom, useAtom } from 'jotai';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { App, Button, FieldGroup, Input, ReacdProvider } from '../../../index.js';

const queryAtom = atom('Initial');

function Example() {
  const [value, setValue] = useAtom(queryAtom);
  return (
    <FieldGroup label="Search controls">
      <Input label="Query" value={value} onValueChange={setValue} />
      <Button label="Clear query" onPress={() => setValue('')} />
    </FieldGroup>
  );
}

it('preserves native tab sequence, child transitions and store isolation', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ReacdProvider>
        <Example />
      </ReacdProvider>
      <ReacdProvider>
        <Example />
      </ReacdProvider>
    </>,
  );
  const inputs = screen.getAllByRole('textbox', { name: 'Query' });
  const clear = screen.getAllByRole('button', { name: 'Clear query' });
  await user.tab();
  expect(inputs[0]).toHaveFocus();
  await user.keyboard('{End}!');
  expect(inputs[0]).toHaveValue('Initial!');
  expect(inputs[1]).toHaveValue('Initial');
  await user.tab();
  expect(clear[0]).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(inputs[0]).toHaveValue('');
  expect(inputs[1]).toHaveValue('Initial');
  expect(screen.getAllByRole('group', { name: 'Search controls' })).toHaveLength(2);
});

it('retains logical orientation inside an explicit RTL application', () => {
  render(
    <ReacdProvider>
      <App direction="rtl">
        <FieldGroup label="Vertical controls" orientation="vertical" />
      </App>
    </ReacdProvider>,
  );
  expect(screen.getByRole('group', { name: 'Vertical controls' })).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
});

it('renders deterministic grouped content for separate SSR requests', () => {
  const renderRequest = () =>
    renderToString(
      <ReacdProvider>
        <Example />
      </ReacdProvider>,
    );
  expect(renderRequest()).toBe(renderRequest());
  expect(renderRequest()).toContain('Search controls');
});
