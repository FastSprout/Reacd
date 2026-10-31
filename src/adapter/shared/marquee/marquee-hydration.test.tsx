import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Marquee, ReacdProvider } from '../../../index.js';
it('hydrates static markup before observing motion preference', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  const tree = (
    <ReacdProvider adapter={activeTestAdapter}>
      <Marquee
        label="Notices"
        paused
        onPausedChange={() => undefined}
        items={[{ id: 'one', label: 'Notice' }]}
      />
    </ReacdProvider>
  );
  const html = renderToString(tree);
  expect(html).toContain('preferences are available');
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('button', { name: 'Resume movement' })).toBeInTheDocument();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
  vi.unstubAllGlobals();
});
