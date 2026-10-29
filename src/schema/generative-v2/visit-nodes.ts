import type { GenerativeNode } from './generative-node.js';

export function visitGenerativeNodes(
  node: GenerativeNode,
  visit: (node: GenerativeNode, path: string) => void,
  path = '$.root',
): void {
  visit(node, path);
  if (node.type === 'Editor')
    node.toolbar?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.toolbar[${index}]`),
    );
  if (node.type === 'ChatPrompt')
    node.footer?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.footer[${index}]`),
    );
  if (node.type === 'ChatPalette')
    node.prompt?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.prompt[${index}]`),
    );
  if (node.type === 'Carousel')
    node.items.forEach((item, index) =>
      item.children.forEach((child, childIndex) =>
        visitGenerativeNodes(
          child, visit, `${path}.items[${index}].children[${childIndex}]`,
        ),
      ),
    );
  if (node.type === 'Card') {
    for (const slot of ['header', 'footer'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'AuthForm') {
    for (const slot of ['leading', 'header', 'footer'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'PricingPlan') {
    for (const slot of ['badge', 'button', 'header', 'footer'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
    node.features?.forEach((feature, index) => {
      if (typeof feature !== 'string')
        feature.leading?.forEach((child, childIndex) =>
          visitGenerativeNodes(
            child, visit, `${path}.features[${index}].leading[${childIndex}]`,
          ),
        );
    });
  }
  if (node.type === 'PricingPlans')
    node.plans?.forEach(({ key: _key, ...plan }, index) =>
      visitGenerativeNodes(
        { ...plan, type: 'PricingPlan' }, visit, `${path}.plans[${index}]`,
      ),
    );
  if (node.type === 'PricingTable')
    node.tiers.forEach((tier, index) => {
      for (const slot of ['badge', 'button'] as const)
        tier[slot]?.forEach((child, childIndex) =>
          visitGenerativeNodes(
            child, visit, `${path}.tiers[${index}].${slot}[${childIndex}]`,
          ),
        );
    });
  if (node.type === 'DashboardGroup')
    node.regions.forEach((region, index) =>
      region.content.forEach((child, position) =>
        visitGenerativeNodes(
          child, visit, `${path}.regions[${index}].content[${position}]`,
        ),
      ),
    );
  if (node.type === 'Sidebar' || node.type === 'DashboardSidebar') {
    for (const slot of ['header', 'footer', 'actions', 'collapsedContent'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'DashboardPanel')
    for (const slot of ['header', 'footer'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  if (node.type === 'DashboardNavbar')
    for (const slot of ['leading', 'trailing', 'start', 'end'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  if (node.type === 'DashboardToolbar')
    for (const slot of ['start', 'end'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  if (node.type === 'BlogPost' || node.type === 'ChangelogVersion') {
    for (const slot of ['header', 'badge', 'authors', 'footer', 'actions'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'BlogPosts')
    node.posts?.forEach(({ key: _key, ...entry }, index) =>
      visitGenerativeNodes(
        { ...entry, type: 'BlogPost' }, visit, `${path}.posts[${index}]`,
      ),
    );
  if (node.type === 'ChangelogVersions')
    node.versions?.forEach(({ key: _key, ...entry }, index) =>
      visitGenerativeNodes(
        { ...entry, type: 'ChangelogVersion' }, visit, `${path}.versions[${index}]`,
      ),
    );
  if (node.type === 'Page') {
    for (const slot of ['left', 'right'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'PageLinks' || node.type === 'PageAnchors')
    node.links?.forEach((item, index) =>
      item.leading?.forEach((child, position) =>
        visitGenerativeNodes(
          child,
          visit,
          `${path}.links[${index}].leading[${position}]`,
        ),
      ),
    );
  if (node.type === 'Splitter')
    node.panels.forEach((panel, index) =>
      panel.content.forEach((child, position) =>
        visitGenerativeNodes(
          child,
          visit,
          `${path}.panels[${index}].content[${position}]`,
        ),
      ),
    );
  if (node.type === 'FooterColumns') {
    for (const slot of ['left', 'right'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'Stepper')
    node.items.forEach((item, itemIndex) =>
      item.content?.forEach((child, index) =>
        visitGenerativeNodes(
          child,
          visit,
          `${path}.items[${itemIndex}].content[${index}]`,
        ),
      ),
    );
  if (
    node.type === 'PageHeader' ||
    node.type === 'PageCTA' ||
    node.type === 'PageHero' ||
    node.type === 'PageSection'
  )
    node.links?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.links[${index}]`),
    );
  if (
    node.type === 'PageFeature' ||
    node.type === 'PageCard' ||
    node.type === 'PageSection'
  )
    node.leading?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.leading[${index}]`),
    );
  if (
    node.type === 'PageCard' ||
    node.type === 'PageHero' ||
    node.type === 'PageCTA' ||
    node.type === 'PageSection'
  ) {
    for (const slot of ['header', 'footer'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (
    node.type === 'PageHero' ||
    node.type === 'PageSection' ||
    node.type === 'PageCTA'
  ) {
    for (const slot of ['top', 'bottom'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'PageSection')
    node.features?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.features[${index}]`),
    );
  if (node.type === 'Tabs')
    node.items.forEach((item, itemIndex) =>
      item.content?.forEach((child, index) =>
        visitGenerativeNodes(
          child,
          visit,
          `${path}.items[${itemIndex}].content[${index}]`,
        ),
      ),
    );
  if (node.type === 'PageAside') {
    for (const slot of ['top', 'bottom'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'Header' || node.type === 'Footer') {
    for (const slot of ['start', 'end', 'top', 'bottom'] as const)
      node[slot]?.forEach((child, index) =>
        visitGenerativeNodes(child, visit, `${path}.${slot}[${index}]`),
      );
  }
  if (node.type === 'Header')
    node.menu?.content.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.menu.content[${index}]`),
    );
  if (node.type === 'Error')
    node.leading?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.leading[${index}]`),
    );
  if (node.type === 'Banner' || node.type === 'Error')
    node.actions?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.actions[${index}]`),
    );
  if (node.type === 'ContentSearch' ||
    node.type === 'Modal' || node.type === 'Popover' || node.type === 'Empty' ||
    node.type === 'Drawer' || node.type === 'Slideover')
    node.footer?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.footer[${index}]`),
    );
  if (node.type === 'Empty') {
    node.leading?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.leading[${index}]`),
    );
    node.actions?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.actions[${index}]`),
    );
  }
  if ('children' in node) {
    node.children?.forEach((child, index) =>
      visitGenerativeNodes(child, visit, `${path}.children[${index}]`),
    );
  }
  if (node.type === 'Accordion')
    node.items.forEach((item, index) =>
      visitGenerativeNodes(item.content, visit, `${path}.items[${index}].content`),
    );
}
