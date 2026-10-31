import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { InputNumber, ReacdProvider } from '../../../index.js';
import { SharedCarousel } from './carousel.adapter.js';
const items = [
  {
    id: 'one',
    label: 'First',
    children: (
      <InputNumber
        label="First required"
        name="first"
        value={1}
        onValueChange={() => undefined}
        required
      />
    ),
  },
  {
    id: 'two',
    label: 'Second',
    children: (
      <InputNumber
        label="Second required"
        name="second"
        value={null}
        onValueChange={() => undefined}
        required
      />
    ),
  },
];
it('excludes inactive required fields from validation and submitted form data', () => {
  const view = render(
    <form aria-label="Slide form">
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedCarousel
          label="Form slides"
          items={items}
          value={0}
          onValueChange={() => undefined}
        />
      </ReacdProvider>
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Slide form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing slide form.');
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form).entries())).toEqual([['first', '1']]);
  view.rerender(
    <form aria-label="Slide form">
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedCarousel
          label="Form slides"
          items={items}
          value={1}
          onValueChange={() => undefined}
        />
      </ReacdProvider>
    </form>,
  );
  expect(form.checkValidity()).toBe(false);
  expect(Array.from(new FormData(form).entries())).toEqual([['second', '']]);
  expect(screen.queryByRole('spinbutton', { name: 'First required' })).toBeNull();
});
