import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';
import { inputMenuSchema } from '../../../schema/input-menu/index.js';

const base = {
  label: 'Text suggestions',
  value: '',
  items: [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta', disabled: true },
  ],
};

it('announces all result states without allowing stale choice activation', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu
        {...base}
        onValueChange={change}
        status="loading"
        loadingMessage="Searching records"
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  expect(screen.getByRole('status')).toHaveTextContent('Searching records');
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu {...base} onValueChange={change} status="error" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('could not be loaded');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu {...base} onValueChange={change} status="loading" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading suggestions');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu
        {...base}
        onValueChange={change}
        status="error"
        errorMessage="Search offline"
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Search offline');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu
        {...base}
        onValueChange={change}
        visibleValues={[]}
        emptyMessage="Nothing available"
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Nothing available');
});

it('submits only accepted text and exempts disabled controls', () => {
  const view = render(
    <form aria-label="Named form">
      <ReacdProvider adapter={shadcnAdapter}>
        <InputMenu
          {...base}
          value="Custom place"
          name="place"
          required
          readOnly
          onValueChange={() => undefined}
          clearable={false}
        />
      </ReacdProvider>
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Named form' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form.');
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form))).toEqual([['place', 'Custom place']]);
  view.rerender(
    <form aria-label="Named form">
      <ReacdProvider adapter={shadcnAdapter}>
        <InputMenu
          {...base}
          name="place"
          required
          disabled
          onValueChange={() => undefined}
        />
      </ReacdProvider>
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form))).toEqual([]);
});

it('rejects invalid preflight and disclosure returns', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const props = inputMenuSchema.parse({
    ...base,
    onValueChange: change,
    onSuggestionSelect: () => 'invalid',
  });
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu {...props} />
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: base.label });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputMenu
        {...inputMenuSchema.parse({
          ...base,
          onValueChange: change,
          open: false,
          onOpenChange: () => null,
        })}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: /Show suggestions/ }));
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(screen.queryByRole('listbox')).toBeNull();
});
