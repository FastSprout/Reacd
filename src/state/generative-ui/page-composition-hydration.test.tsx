import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

class MediaProbe extends EventTarget {
  matches = true;
}

afterEach(() => vi.unstubAllGlobals());

it('preserves focus and request state through aside hydration', async () => {
  const user = userEvent.setup();
  const media = new MediaProbe();
  vi.stubGlobal('matchMedia', () => media);
  const declaration = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [{ key: 'query', kind: 'text', initial: '', access: 'readWrite' }],
    root: {
      type: 'PageBody',
      children: [
        {
          type: 'PageAside',
          label: 'Hydrated navigation',
          children: [
            { type: 'Button', label: 'Local navigation action', action: 'navigate' },
          ],
        },
        {
          type: 'Input',
          label: 'Hydrated page query',
          value: { state: 'query', mode: 'readWrite' },
        },
      ],
    },
  });
  const actions = { navigate: vi.fn() };
  const container = document.createElement('div');
  const markup = renderToString(
    <GenerativeUI document={declaration} actions={actions} />,
  );
  expect(markup).toContain('data-wide="false"');
  container.innerHTML = markup;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<GenerativeUI document={declaration} actions={actions} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const aside = screen.getByRole('complementary', { name: 'Hydrated navigation' });
  expect(aside).toHaveAttribute('data-wide', 'true');
  await user.type(screen.getByLabelText('Hydrated page query'), 'Client query');
  const action = screen.getByRole('button', { name: 'Local navigation action' });
  action.focus();
  act(() => {
    media.matches = false;
    media.dispatchEvent(new Event('change'));
  });
  expect(aside).toHaveAttribute('data-wide', 'false');
  expect(action).toHaveFocus();
  await user.click(action);
  expect(actions.navigate).toHaveBeenCalledOnce();
  expect(
    renderToString(<GenerativeUI document={declaration} actions={actions} />),
  ).not.toContain('Client query');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
