import { atom, useAtom } from 'jotai';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { App, Input, ReacdProvider, Text, createReacdStore } from '../../../index.js';
import type { CarouselProps } from '../../../components/carousel/index.js';
import { ShadcnCarousel } from './carousel.adapter.js';
import { CarouselFocusBoundary } from './focus-boundary.js';
const indexAtom = atom(0);
const draftAtom = atom('Draft');
const BASE = { label: 'Highlights', value: 0, onValueChange: () => undefined };
const ITEMS = [
  { id: 'first', label: 'First', children: <Text>First content</Text> },
  { id: 'second', label: 'Second', children: <Text>Second content</Text> },
  { id: 'third', label: 'Third', children: <Text>Third content</Text> },
];
function Example(properties: Partial<CarouselProps>) {
  const [value, setValue] = useAtom(indexAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const items = [
    {
      id: 'first',
      label: 'First',
      children: <Input label="Slide note" value={draft} onValueChange={setDraft} />,
    },
    ...ITEMS.slice(1),
  ];
  return (
    <ShadcnCarousel
      {...BASE}
      items={items}
      value={value}
      onValueChange={setValue}
      {...properties}
    />
  );
}
it('retains inactive editor state and leaves nested caret keys native', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <Example />
    </ReacdProvider>,
  );
  const note = screen.getByRole('textbox', { name: 'Slide note' });
  await user.type(note, ' edited{ArrowRight}{Home}{End}');
  expect(note).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(screen.queryByRole('textbox', { name: 'Slide note' })).toBeNull();
  expect(screen.getByText('Second content')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Previous slide' }));
  expect(screen.getByRole('textbox', { name: 'Slide note' })).toHaveValue(
    'Draft edited',
  );
});
it('repairs old-panel focus without stealing outside focus', async () => {
  const user = userEvent.setup();
  const store = createReacdStore();
  render(
    <ReacdProvider store={store}>
      <Example />
      <Input label="Outside note" value="Outside" onValueChange={() => undefined} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('textbox', { name: 'Slide note' }));
  act(() => {
    store.set(indexAtom, 1);
  });
  const region = screen.getByRole('region', { name: 'Highlights' });
  expect(region).toHaveFocus();
  const outside = screen.getByRole('textbox', { name: 'Outside note' });
  await user.click(outside);
  act(() => {
    store.set(indexAtom, 0);
  });
  expect(outside).toHaveFocus();
  await user.click(screen.getByRole('textbox', { name: 'Slide note' }));
  act(() => {
    store.set(indexAtom, 2);
  });
  expect(region).toHaveFocus();
});
it('requests chooser transitions and preserves rejected host values', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={ITEMS} onValueChange={change} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(change).toHaveBeenLastCalledWith(1);
  expect(screen.getByText('First content')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Third, slide 3' }));
  expect(change).toHaveBeenLastCalledWith(2);
  expect(screen.getByText('First content')).toBeVisible();
});
it('navigates horizontal RTL, vertical axes, boundaries and loops', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider>
      <App direction="rtl">
        <Example loop />
      </App>
    </ReacdProvider>,
  );
  let region = screen.getByRole('region', { name: 'Highlights' });
  region.focus();
  await user.keyboard('{ArrowLeft}');
  expect(screen.getByText('Second content')).toBeVisible();
  await user.keyboard('{ArrowRight}{ArrowRight}');
  expect(screen.getByText('Third content')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(screen.getByRole('textbox', { name: 'Slide note' })).toBeVisible();
  view.rerender(
    <ReacdProvider>
      <Example orientation="vertical" />
    </ReacdProvider>,
  );
  region = screen.getByRole('region', { name: 'Highlights' });
  region.focus();
  await user.keyboard('{ArrowDown}{End}');
  expect(screen.getByText('Third content')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
  await user.keyboard('{ArrowUp}{Home}{ArrowUp}');
  expect(screen.getByRole('textbox', { name: 'Slide note' })).toBeVisible();
  await user.keyboard('x');
});
it('protects navigation and renders loading/error/empty states', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const retry = vi.fn();
  const view = render(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={ITEMS} readOnly onValueChange={change} />
    </ReacdProvider>,
  );
  const region = screen.getByRole('region', { name: 'Highlights' });
  region.focus();
  await user.keyboard('{ArrowRight}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={ITEMS} disabled />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled();
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={[]} emptyMessage="Empty slides" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Empty slides');
  expect(screen.queryByRole('button')).toBeNull();
  region.focus();
  await user.keyboard('{ArrowRight}');
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel
        {...BASE}
        items={ITEMS}
        state="loading"
        loadingMessage="Wait for slides"
      />
    </ReacdProvider>,
  );
  region.focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('status')).toHaveTextContent('Wait for slides');
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={ITEMS} state="error" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load slides.');
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel
        {...BASE}
        items={ITEMS}
        state="error"
        errorMessage="Failed"
        retryLabel="Try slides"
        onRetry={retry}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Try slides' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  view.rerender(
    <ReacdProvider>
      <ShadcnCarousel {...BASE} items={ITEMS.slice(0, 1)} />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('button')).toBeNull();
});
it('safely handles detached focus boundaries and absent prior slide elements', () => {
  const properties = {
    label: 'Detached',
    value: 0,
    activeKey: 'new',
    children: null,
    onKeyDown: () => undefined,
  };
  const boundary = new CarouselFocusBoundary(properties);
  expect(boundary.getSnapshotBeforeUpdate({ ...properties, activeKey: 'old' })).toBe(
    false,
  );
  expect(() => boundary.componentDidUpdate(properties, {}, true)).not.toThrow();
  const view = render(
    <CarouselFocusBoundary {...properties}>Placeholder</CarouselFocusBoundary>,
  );
  view.rerender(
    <CarouselFocusBoundary {...properties} activeKey="changed">
      Placeholder
    </CarouselFocusBoundary>,
  );
  fireEvent.keyDown(screen.getByRole('region'), { key: 'Home' });
});
