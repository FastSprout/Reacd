import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen, within } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { App, ReacdProvider } from '../../../index.js';
import { SharedMarquee } from './marquee.adapter.js';
const BASE = {
  label: 'Notices',
  items: [{ id: 'one', label: 'Read this notice' }],
  paused: true,
  onPausedChange: () => undefined,
};
function motion(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}
it('requests controlled motion without accessible copies', async () => {
  motion(false);
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} onPausedChange={change} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Resume movement' }));
  expect(change).toHaveBeenLastCalledWith(false);
  expect(screen.getByRole('button', { name: 'Resume movement' })).toBeInTheDocument();
  const viewport = view.container.querySelector('.reacd-marquee-viewport');
  expect(viewport).toHaveAttribute('aria-hidden', 'true');
  expect(viewport).toHaveAttribute('inert');
  expect(viewport?.querySelectorAll('a,button,input,[tabindex]')).toHaveLength(0);
  expect(screen.getByRole('list', { name: 'Notices' })).not.toBeVisible();
  await user.click(screen.getByText('Read all notices'));
  const list = screen.getByRole('list', { name: 'Notices' });
  expect(within(list).getAllByRole('listitem')).toHaveLength(1);
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} paused={false} onPausedChange={change} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Pause movement' }));
  expect(change).toHaveBeenLastCalledWith(true);
  vi.unstubAllGlobals();
});
it('uses static text for reduced motion, readonly or unknown preference', () => {
  motion(true);
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('reduced-motion preference');
  expect(screen.getByRole('list', { name: 'Notices' })).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
  motion(false);
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} readOnly />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Read-only notices');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} items={[]} emptyMessage="No text" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('No text');
  expect(screen.queryByRole('button')).toBeNull();
  vi.stubGlobal('matchMedia', undefined);
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('preferences are available');
  vi.unstubAllGlobals();
});
it('maps logical direction and semantic pace without public CSS escapes', () => {
  motion(false);
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <App direction="rtl">
        <SharedMarquee {...BASE} pace="slow" />
      </App>
    </ReacdProvider>,
  );
  expect(view.container.querySelector('.reacd-marquee-track')).toHaveAttribute(
    'data-reverse',
    'true',
  );
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedMarquee {...BASE} direction="backward" pace="fast" />
    </ReacdProvider>,
  );
  expect(view.container.querySelector('.reacd-marquee-track')).toHaveAttribute(
    'data-reverse',
    'true',
  );
  expect(view.container.querySelector('.reacd-marquee-track')).toHaveStyle({
    '--reacd-marquee-duration': 'var(--reacd-marquee-fast)',
  });
  vi.unstubAllGlobals();
});
