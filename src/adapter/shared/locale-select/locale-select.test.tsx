import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { atom, useAtom } from 'jotai';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../state/provider/provider.js';
import { SharedLocaleSelect } from './locale-select.adapter.js';
import type { LocaleSelectProps } from '../../../components/locale-select/index.js';

const locales = [
  { code: 'en-US', label: 'English' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'ar', label: 'Arabic' },
];
const localeAtom = atom('en-US');
function Example(props: Partial<LocaleSelectProps>) {
  const [value, setValue] = useAtom(localeAtom);
  return (
    <SharedLocaleSelect
      label="Language"
      value={value}
      locales={locales}
      onValueChange={setValue}
      name="locale"
      description="Application language"
      {...props}
    />
  );
}

it('selects canonical values by keyboard and submits native form data', async () => {
  const user = userEvent.setup();
  const view = render(
    <form aria-label="Settings">
      <ReacdProvider adapter={activeTestAdapter}>
        <Example required />
      </ReacdProvider>
    </form>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Language' });
  expect(trigger).toHaveAccessibleDescription('Application language');
  await user.tab();
  expect(trigger).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  await screen.findByRole('option', { name: 'Arabic' });
  await user.keyboard('Arabic{Enter}');
  expect(trigger).toHaveTextContent('Arabic');
  expect(trigger).toHaveFocus();
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Settings form is missing.');
  expect(new FormData(form).get('locale')).toBe('ar');
  expect(form.checkValidity()).toBe(true);
});

it('retains rejected changes and protects readonly values', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Example onValueChange={change} />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Language' });
  await user.click(trigger);
  await user.click(screen.getByRole('option', { name: 'Polish' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('pl-PL');
  expect(trigger).toHaveTextContent('English');
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <Example readOnly onValueChange={change} />
    </ReacdProvider>,
  );
  await user.click(trigger);
  await user.click(screen.getByRole('option', { name: 'Arabic' }));
  expect(change).toHaveBeenCalledOnce();
  expect(trigger).toHaveAttribute('aria-readonly', 'true');
  expect(trigger).toHaveTextContent('English');
});

it('omits disabled controls and allows missing optional descriptions', () => {
  const view = render(
    <form>
      <ReacdProvider adapter={activeTestAdapter}>
        <Example disabled description={undefined} />
      </ReacdProvider>
    </form>,
  );
  expect(screen.getByRole('combobox', { name: 'Language' })).toBeDisabled();
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Settings form is missing.');
  expect(new FormData(form).has('locale')).toBe(false);
});

it('renders consistent selected text across server requests', () => {
  const request = () =>
    renderToString(
      <ReacdProvider adapter={activeTestAdapter}>
        <Example />
      </ReacdProvider>,
    );
  expect(request()).toBe(request());
  expect(request()).toContain('English');
});

it('retains a literal code at the private defensive boundary', () => {
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Example value="fr" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('combobox', { name: 'Language' })).toHaveTextContent('fr');
});

it('keeps inactive portal controls closed', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <PortalActiveContext.Provider value={false}>
        <Example />
      </PortalActiveContext.Provider>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Language' }));
  expect(screen.queryByRole('option')).not.toBeInTheDocument();
});
