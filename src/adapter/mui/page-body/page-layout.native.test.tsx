import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiPageAside } from '../page-aside/page-aside.adapter.js';
import { MuiPageBody } from './page-body.adapter.js';
import { MuiPageColumns } from '../page-columns/page-columns.adapter.js';
import { MuiPageGrid } from '../page-grid/page-grid.adapter.js';
import { MuiPageList } from '../page-list/page-list.adapter.js';
import { MuiPageLogos } from '../page-logos/page-logos.adapter.js';

it('composes named aside/article layouts and preserves content order', () => {
  const view = render(
    <MuiPageAside label="Related" top="First" bottom="Last">
      <MuiPageBody>
        <MuiPageColumns>{['Alpha', null, false, 'Beta']}</MuiPageColumns>
        <MuiPageGrid>{['Gamma', 'Delta']}</MuiPageGrid>
      </MuiPageBody>
    </MuiPageAside>,
  );
  const aside = screen.getByRole('complementary', { name: 'Related' });
  expect(aside).toHaveTextContent('FirstAlphaBetaGammaDeltaLast');
  expect(within(aside).getByRole('article')).toBeVisible();
  expect(view.container.querySelector('.MuiStack-root')).toBeInTheDocument();
  expect(view.container.querySelector('.MuiGrid-root')).toBeInTheDocument();
});

it('keeps list semantics, dividers and absent children', () => {
  const view = render(<MuiPageList>{['Alpha', false, null, 'Beta']}</MuiPageList>);
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.queryByRole('separator')).toBeNull();
  view.rerender(<MuiPageList divide>{['Alpha', 'Beta']}</MuiPageList>);
  expect(screen.getAllByRole('separator')).toHaveLength(1);
  view.rerender(<MuiPageList divide />);
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.queryByRole('listitem')).toBeNull();
});

it('keeps logo labels, retries changed sources and renders empty states', () => {
  const view = render(
    <MuiPageLogos label="Integrations" title="Compatible services"
      items={[{ key: 'service', src: '/service.svg', alt: 'Example service' }]} />,
  );
  expect(screen.getByRole('heading', { name: 'Compatible services' })).toBeVisible();
  expect(screen.getByRole('list', { name: 'Integrations' })).toBeVisible();
  fireEvent.error(screen.getByRole('img', { name: 'Example service' }));
  expect(screen.getByRole('img', { name: 'Example service' }))
    .toHaveTextContent('Image unavailable');
  view.rerender(
    <MuiPageLogos label="Integrations"
      items={[{ key: 'service', src: '/updated.svg', alt: 'Example service' }]} />,
  );
  expect(screen.getByRole('img', { name: 'Example service' }))
    .toHaveAttribute('src', '/updated.svg');
  view.rerender(<MuiPageLogos label="Integrations" items={[]} />);
  expect(screen.getByText('No logos to display.')).toBeVisible();
  view.rerender(<MuiPageLogos label="Integrations" items={[]}
    emptyLabel="Nothing configured" />);
  expect(screen.getByText('Nothing configured')).toBeVisible();
});
