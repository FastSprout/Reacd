import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { SharedApp } from './app.adapter.js';
import { ReacdProvider } from '../../../state/provider/provider.js';
import { Select } from '../../../components/select/select.js';
import { Slider } from '../../../components/slider/slider.js';
import { Tabs } from '../../../components/tabs/tabs.js';

let restoreLayout: () => void;
beforeEach(() => {
  restoreLayout = installLayout();
});
afterEach(() => restoreLayout());

const ITEMS = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
];

it('sets language and reading direction from closed application props', () => {
  const { rerender } = render(<SharedApp>Default app</SharedApp>);
  expect(screen.getByText('Default app')).toHaveAttribute('lang', 'en');
  expect(screen.getByText('Default app')).toHaveAttribute('dir', 'ltr');
  rerender(
    <SharedApp direction="rtl" language="ar">
      Arabic app
    </SharedApp>,
  );
  expect(screen.getByText('Arabic app')).toHaveAttribute('lang', 'ar');
  expect(screen.getByText('Arabic app')).toHaveAttribute('dir', 'rtl');
});

it('propagates RTL to portaled Select content', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedApp direction="rtl">
        <Select
          label="Direction choice"
          value="first"
          items={ITEMS}
          onValueChange={vi.fn()}
        />
      </SharedApp>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Direction choice' }));
  expect((await screen.findByRole('listbox')).closest('[dir]')).toHaveAttribute(
    'dir',
    'rtl',
  );
  await user.keyboard('{Escape}');
});

it('reverses RTL Slider and Tabs keyboard navigation', async () => {
  const user = userEvent.setup();
  const resize = vi.fn();
  const change = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedApp direction="rtl">
        <Slider
          label="Direction amount"
          min={0}
          max={10}
          value={5}
          onValueChange={resize}
        />
        <Tabs
          label="Direction tabs"
          value="first"
          items={ITEMS}
          onValueChange={change}
        />
      </SharedApp>
    </ReacdProvider>,
  );
  (await screen.findByRole('slider')).focus();
  await user.keyboard('{ArrowLeft}');
  expect(resize).toHaveBeenLastCalledWith(6);
  screen.getByRole('tab', { name: 'First' }).focus();
  await user.keyboard('{ArrowLeft}');
  expect(change).toHaveBeenLastCalledWith('second');
});

it('uses the nearest nested App direction', async () => {
  const user = userEvent.setup();
  const resize = vi.fn();
  const change = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedApp direction="rtl">
        <SharedApp direction="ltr">
          <Select
            label="Nested direction"
            value="first"
            items={ITEMS}
            onValueChange={vi.fn()}
          />
          <Slider
            label="Nested amount"
            min={0}
            max={10}
            value={5}
            onValueChange={resize}
          />
          <Tabs
            label="Nested tabs"
            value="first"
            items={ITEMS}
            onValueChange={change}
          />
        </SharedApp>
      </SharedApp>
    </ReacdProvider>,
  );
  (await screen.findByRole('slider')).focus();
  await user.keyboard('{ArrowLeft}');
  expect(resize).toHaveBeenLastCalledWith(4);
  screen.getByRole('tab', { name: 'First' }).focus();
  await user.keyboard('{ArrowLeft}');
  expect(change).toHaveBeenLastCalledWith('third');
  await user.click(screen.getByRole('combobox', { name: 'Nested direction' }));
  expect((await screen.findByRole('listbox')).closest('[dir]')).toHaveAttribute(
    'dir',
    'ltr',
  );
});
