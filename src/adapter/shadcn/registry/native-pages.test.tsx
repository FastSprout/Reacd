import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  defineThemeAdapter,
  ReacdProvider,
  PageAside,
  PageBody,
  PageColumns,
  PageGrid,
  PageList,
  PageLogos,
  PageFeature,
  PageCard,
  PageCTA,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativePagesEntries } from './native-pages.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativePagesEntries },
});
it.each([
  <PageAside label="Aside" key="aside">
    Declared
  </PageAside>,
  <PageBody key="body">Declared</PageBody>,
  <PageColumns key="columns">Declared</PageColumns>,
  <PageGrid key="grid">Declared</PageGrid>,
  <PageList key="list">Declared</PageList>,
  <PageLogos key="logos" label="Art" items={[]} emptyLabel="Declared" />,
  <PageFeature key="feature" title="Declared" />,
  <PageCard key="card" title="Declared" />,
  <PageCTA key="cta" title="Declared" />,
])('renders the registered closed declaration through selected SDK %#', (node) => {
  render(<ReacdProvider adapter={adapter}>{node}</ReacdProvider>);
  expect(screen.getByText('Declared')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});
