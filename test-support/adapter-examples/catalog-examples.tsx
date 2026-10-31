import {
  SelectMenu,
  Listbox,
  Toast,
  ContentNavigation,
  ContentToc,
  AuthForm,
  PageLogos,
  ContentSurround,
  ContentSearch,
  ContentSearchButton,
  PricingPlan,
  PricingPlans,
  PricingTable,
  BlogPost,
  BlogPosts,
  ChangelogVersion,
  ChangelogVersions,
  Drawer,
  Slideover,
  ContextMenu,
  DropdownMenu,
  Sidebar,
  Splitter,
  PageAnchors,
  PageLinks,
  PageCTA,
  CommandPalette,
  InputTags,
  Tree,
  FooterColumns,
  NavigationMenu,
  Stepper,
  PageHeader,
  PageFeature,
  PageCard,
  PageHero,
  PageSection,
  App,
  Error,
  Theme,
  Timeline,
  ScrollArea,
  Text,
  InputRating,
  PageAside,
  PageBody,
  PageColumns,
  PageGrid,
  PageList,
} from '../../src/index.js';

export const CATALOG_EXAMPLES = {
  SelectMenu: (
    <SelectMenu
      label="Example selection"
      items={[]}
      value=""
      onValueChange={() => undefined}
    />
  ),
  Listbox: (
    <Listbox
      label="Example inline choices"
      items={[]}
      value=""
      onValueChange={() => undefined}
    />
  ),
  Toast: <Toast title="Notice" open={false} onOpenChange={() => {}} />,
  ContentNavigation: (
    <ContentNavigation
      label="Example outline"
      items={[]}
      expandedKeys={[]}
      onExpandedKeysChange={() => undefined}
    />
  ),
  ContentToc: <ContentToc label="Example table of contents" items={[]} />,
  AuthForm: (
    <AuthForm label="Example form" submitLabel="Submit example" onSubmit={() => {}} />
  ),
  PageLogos: <PageLogos label="Example marks" items={[]} />,
  ContentSurround: <ContentSurround />,
  ContentSearch: (
    <ContentSearch
      title="Example documentation"
      label="Example query"
      query=""
      groups={[]}
      open={false}
      onOpenChange={() => undefined}
      onQueryChange={() => undefined}
    />
  ),
  ContentSearchButton: (
    <ContentSearchButton open={false} onOpenChange={() => undefined} />
  ),
  PricingPlan: <PricingPlan />,
  PricingPlans: <PricingPlans />,
  PricingTable: (
    <PricingTable
      caption="Example plans"
      sections={[]}
      tiers={[{ id: 'example', title: 'Example tier' }]}
    />
  ),
  ...DASHBOARD_EXAMPLES,
  BlogPost: <BlogPost />,
  BlogPosts: <BlogPosts />,
  ChangelogVersion: <ChangelogVersion />,
  ChangelogVersions: <ChangelogVersions />,
  Drawer: (
    <Drawer
      title="Example drawer"
      description="Drawer body"
      open={false}
      onOpenChange={() => undefined}
    />
  ),
  Slideover: (
    <Slideover
      title="Example sheet"
      description="Sheet body"
      open={false}
      onOpenChange={() => undefined}
    />
  ),
  DropdownMenu: (
    <DropdownMenu label="Actions" items={[]} open={false} onOpenChange={() => {}} />
  ),
  ContextMenu: (
    <ContextMenu label="Actions" items={[]} open={false} onOpenChange={() => {}} />
  ),
  Sidebar: (
    <Sidebar
      title="Example sidebar"
      open={false}
      mobileOpen={false}
      onOpenChange={() => undefined}
      onMobileOpenChange={() => undefined}
    />
  ),
  Splitter: (
    <Splitter
      label="Example split panels"
      panels={[
        { id: 'first', label: 'First', content: <Text>First</Text> },
        { id: 'last', label: 'Last', content: <Text>Last</Text> },
      ]}
      value={[
        { id: 'first', share: 50 },
        { id: 'last', share: 50 },
      ]}
      onValueChange={() => undefined}
    />
  ),
  PageAnchors: <PageAnchors label="Example page anchors" />,
  PageLinks: <PageLinks label="Example page links" />,
  PageCTA: <PageCTA title="Example call to action" />,
  CommandPalette: (
    <CommandPalette
      label="Example commands"
      query=""
      groups={[]}
      onQueryChange={() => undefined}
    />
  ),
  InputTags: (
    <InputTags label="Example tags" value={[]} onValueChange={() => undefined} />
  ),
  Tree: (
    <Tree
      label="Example tree"
      items={[]}
      value={[]}
      expanded={[]}
      onValueChange={() => undefined}
      onExpandedChange={() => undefined}
    />
  ),
  FooterColumns: <FooterColumns label="Example footer columns" columns={[]} />,
  NavigationMenu: <NavigationMenu label="Example navigation menu" items={[]} />,
  Stepper: (
    <Stepper
      label="Example progress steps"
      value="one"
      onValueChange={() => undefined}
      items={[{ key: 'one', title: 'One' }]}
    />
  ),
  PageHeader: <PageHeader title="Example PageHeader" />,
  PageFeature: <PageFeature title="Example PageFeature" />,
  PageCard: <PageCard title="Example PageCard" />,
  PageHero: <PageHero title="Example PageHero" />,
  PageSection: <PageSection title="Example PageSection" />,
  PageAside: (
    <PageAside label="Example aside">
      <Text>Aside</Text>
    </PageAside>
  ),
  PageBody: (
    <PageBody>
      <Text>Body</Text>
    </PageBody>
  ),
  PageColumns: (
    <PageColumns>
      <Text>Flow</Text>
    </PageColumns>
  ),
  PageGrid: (
    <PageGrid>
      <Text>Grid</Text>
    </PageGrid>
  ),
  PageList: (
    <PageList>
      <Text>List</Text>
    </PageList>
  ),
  InputRating: (
    <InputRating label="Example rating" value={2} onValueChange={() => undefined} />
  ),
  App: (
    <App>
      <Text>Application content</Text>
    </App>
  ),
  Error: <Error statusCode={404} title="Missing example" />,
  Theme: (
    <Theme>
      <Text>Themed content</Text>
    </Theme>
  ),
  Timeline: (
    <Timeline label="Example events" items={[{ id: 'created', title: 'Created' }]} />
  ),
  ScrollArea: (
    <ScrollArea label="Scrollable example">
      <Text>Content</Text>
    </ScrollArea>
  ),
};
import { DASHBOARD_EXAMPLES } from './dashboard-examples.js';
