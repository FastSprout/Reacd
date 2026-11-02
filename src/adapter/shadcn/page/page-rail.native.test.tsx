import { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ShadcnPageRail } from './page-rail.js';

function Activity() {
  return <output>{String(useContext(PortalActiveContext))}</output>;
}

it('uses SDK disclosure while retaining content and suppressing hidden portals', () => {
  const view = render(
    <ShadcnPageRail label="Navigation" wide={false}>
      <Activity />
    </ShadcnPageRail>,
  );
  expect(screen.getByText('false')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
  expect(screen.getByText('true')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Navigation' }));
  expect(screen.getByText('false')).not.toBeVisible();
  view.rerender(
    <PortalActiveContext.Provider value={false}>
      <ShadcnPageRail label="Navigation" wide>
        <Activity />
      </ShadcnPageRail>
    </PortalActiveContext.Provider>,
  );
  expect(screen.getByText('false')).toBeVisible();
});

it('allows native viewport scrolling before SDK hydration', () => {
  render(
    <ShadcnPageRail label="Navigation" wide>
      Navigation links
    </ShadcnPageRail>,
  );
  const viewport = screen
    .getAllByRole('region', { name: 'Navigation' })
    .find((element) => element.tabIndex === 0);
  expect(viewport).toHaveStyle({ overflowY: 'auto' });
});
