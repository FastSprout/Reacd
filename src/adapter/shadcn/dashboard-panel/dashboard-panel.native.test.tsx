import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MainScopeContext } from '../../../renderer/main/main-scope.js';
import { DashboardRegionContext } from '../dashboard-group/dashboard-context.js';
import { ShadcnDashboardPanel } from './dashboard-panel.adapter.js';

it('uses one main landmark, nested regions, region labels and every slot', () => {
  const view = render(
    <ShadcnDashboardPanel label="Work" header="Top" footer="End">
      Body
    </ShadcnDashboardPanel>,
  );
  expect(screen.getByRole('main', { name: 'Work' })).toHaveTextContent('TopBodyEnd');
  view.rerender(
    <MainScopeContext value={true}>
      <DashboardRegionContext value={{ id: 'work', label: 'Inherited', kind: 'panel' }}>
        <ShadcnDashboardPanel>Details</ShadcnDashboardPanel>
      </DashboardRegionContext>
    </MainScopeContext>,
  );
  expect(screen.getByRole('region', { name: 'Inherited' })).toBeVisible();
  expect(screen.queryByRole('main')).toBeNull();
  view.rerender(<ShadcnDashboardPanel />);
  expect(screen.getByRole('alert')).toHaveTextContent('requires a label');
});
