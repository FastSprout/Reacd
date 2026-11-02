import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  ContentNavigation,
  ContentToc,
  Header,
  NavigationMenu,
  PageHero,
  PageSection,
  ReacdProvider,
  ScrollArea,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';

it('renders the closed website composition through its selected SDK registry', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Header title="reacd" />
      <PageHero title="Interfaces" />
      <PageSection title="Components" />
      <NavigationMenu
        label="Main"
        items={[{ key: 'home', label: 'Home', href: '/' }]}
      />
      <ContentNavigation
        label="Documentation"
        items={[]}
        expandedKeys={[]}
        onExpandedKeysChange={() => undefined}
      />
      <ContentToc label="Contents" items={[]} />
      <ScrollArea label="References">Reference content</ScrollArea>
    </ReacdProvider>,
  );
  expect(screen.getByRole('banner')).not.toBeNull();
  expect(screen.getByRole('heading', { name: 'Interfaces', level: 1 })).not.toBeNull();
  expect(screen.getByRole('heading', { name: 'Components', level: 2 })).not.toBeNull();
  expect(screen.getByRole('navigation', { name: 'Main' })).not.toBeNull();
  expect(screen.getByRole('region', { name: 'References' })).not.toBeNull();
});
