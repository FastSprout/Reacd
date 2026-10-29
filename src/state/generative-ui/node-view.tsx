import type { ReactNode } from 'react';
import { FormNodeView } from './form-node-view.js';
import { ChatComposerNodeView } from './chat-composer-node-view.js';
import {
  Button,
  Avatar,
  AvatarGroup,
  Grid,
  HStack,
  Link,
  Text,
  VStack,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundText } from './bound-text.js';
import { BoundInput } from './bound-input.js';
import { BoundBoolean } from './bound-boolean.js';
import { BoundDataTable } from './bound-data-table.js';
import { BoundAccordion } from './bound-accordion.js';
import { BoundModal } from './bound-modal.js';
import { BoundCollapsible } from './bound-collapsible.js';
import { BoundRadioGroup } from './bound-radio-group.js';
import { BoundCheckboxGroup } from './bound-checkbox-group.js';
import { GenerativeChip } from './generative-chip.js';
import { BoundPopover } from './bound-popover.js';
import { DisplayNodeView } from './display-node-view.js';
import { BoundPagination } from './bound-pagination.js';
import { GenerativeBreadcrumb } from './generative-breadcrumb.js';
import { CatalogNodeView } from './catalog-node-view.js';
import { PageNodeView } from './page-node-view.js';
import { BoundTabs } from './bound-tabs.js';
import { BoundCommandPalette } from './bound-command-palette.js';
import { PageNavigationNodeView } from './page-navigation-node-view.js';
import { SidebarSplitterNodeView } from './sidebar-splitter-node-view.js';
import { BoundInputTags } from './bound-input-tags.js';
import { BoundTree } from './bound-tree.js';
import { BoundStepper } from './bound-stepper.js';
import { GenerativeFooterColumns } from './generative-footer-columns.js';
import { GenerativeNavigationMenu } from './generative-navigation-menu.js';
import { PagePresentationNodeView } from './page-presentation-node-view.js';
import { isCompositionNode, CompositionNodeView } from './composition-node-view.js';

export function GenerativeNodeView({
  node,
  registry,
  actions,
}: {
  node: GenerativeNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  const renderChild = (child: GenerativeNode, index: number) => (
    <GenerativeNodeView
      key={index}
      node={child}
      registry={registry}
      actions={actions}
    />
  );
  if (isCompositionNode(node))
    return (
      <CompositionNodeView
        node={node} registry={registry} actions={actions} renderChild={renderChild}
      />
    );
  switch (node.type) {
    case 'ChatPrompt':
    case 'ChatPromptSubmit':
    case 'ChatPalette':
      return (
        <ChatComposerNodeView
          node={node} registry={registry} actions={actions} renderChild={renderChild}
        />
      );
    case 'Form':
    case 'FormField':
    case 'SubmitButton':
    case 'Switch':
    case 'Textarea':
    case 'SelectMenu':
    case 'Listbox':
    case 'InputMenu':
    case 'Checkbox':
    case 'Select':
    case 'Slider':
    case 'ColorPicker':
    case 'FileUpload':
      return (
        <FormNodeView
          node={node} registry={registry} actions={actions} renderChild={renderChild}
        />
      );
    case 'Sidebar':
    case 'Splitter':
      return (
        <SidebarSplitterNodeView
          node={node}
          registry={registry}
          renderChild={renderChild}
        />
      );
    case 'Page':
    case 'Section':
    case 'PageCTA':
    case 'PageAnchors':
    case 'PageLinks':
      return <PageNavigationNodeView node={node} renderChild={renderChild} />;
    case 'CommandPalette':
      return <BoundCommandPalette node={node} registry={registry} actions={actions} />;
    case 'InputTags':
      return <BoundInputTags node={node} registry={registry} />;
    case 'Tree':
      return <BoundTree node={node} registry={registry} />;
    case 'Stepper':
      return <BoundStepper node={node} registry={registry} renderChild={renderChild} />;
    case 'FooterColumns':
      return (
        <GenerativeFooterColumns
          node={node}
          registry={registry}
          actions={actions}
          renderChild={renderChild}
        />
      );
    case 'NavigationMenu':
      return (
        <GenerativeNavigationMenu node={node} registry={registry} actions={actions} />
      );
    case 'PageHeader':
    case 'PageFeature':
    case 'PageCard':
    case 'PageHero':
    case 'PageSection':
      return (
        <PagePresentationNodeView
          node={node}
          renderChild={renderChild}
          registry={registry}
          actions={actions}
        />
      );
    case 'Tabs':
      return <BoundTabs node={node} registry={registry} renderChild={renderChild} />;
    case 'Link': {
      const { type: _type, ...properties } = node;
      return <Link {...properties} />;
    }
    case 'PageAside':
    case 'PageBody':
    case 'PageColumns':
    case 'PageGrid':
    case 'PageList':
      return <PageNodeView node={node} renderChild={renderChild} />;
    case 'InputRating':
    case 'App':
    case 'Error':
    case 'Theme':
    case 'Timeline':
    case 'ScrollArea':
    case 'Container':
    case 'Main':
    case 'Header':
    case 'Footer':
    case 'Separator':
    case 'ProgressGroup':
    case 'User':
    case 'Banner':
    case 'InputNumber':
    case 'PinInput':
      return (
        <CatalogNodeView
          node={node}
          registry={registry}
          actions={actions}
          renderChild={renderChild}
        />
      );
    case 'Pagination':
      return <BoundPagination node={node} registry={registry} />;
    case 'Breadcrumb':
      return <GenerativeBreadcrumb node={node} registry={registry} actions={actions} />;
    case 'Badge':
    case 'Skeleton':
    case 'ContentNavigation':
    case 'ContentToc':
    case 'Empty':
    case 'Kbd':
    case 'Tooltip':
      return (
        <DisplayNodeView node={node} registry={registry} renderChild={renderChild} />
      );
    case 'Popover':
      return (
        <BoundPopover
          node={node}
          registry={registry}
          footer={node.footer?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </BoundPopover>
      );
    case 'Chip':
      return (
        <GenerativeChip node={node} registry={registry}>
          {node.children.map(renderChild)}
        </GenerativeChip>
      );
    case 'Avatar': {
      const { type: _type, ...properties } = node;
      return <Avatar {...properties} />;
    }
    case 'AvatarGroup': {
      const { type: _type, ...properties } = node;
      return <AvatarGroup {...properties} />;
    }
    case 'RadioGroup':
      return <BoundRadioGroup node={node} registry={registry} />;
    case 'CheckboxGroup':
      return <BoundCheckboxGroup node={node} registry={registry} />;
    case 'Collapsible':
      return (
        <BoundCollapsible node={node} registry={registry}>
          {node.children.map(renderChild)}
        </BoundCollapsible>
      );
    case 'Modal':
      return (
        <BoundModal
          node={node}
          registry={registry}
          footer={node.footer?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </BoundModal>
      );
    case 'Accordion':
      return (
        <BoundAccordion
          node={node}
          registry={registry}
          items={node.items.map((item) => ({
            ...item,
            content: (
              <GenerativeNodeView
                node={item.content}
                registry={registry}
                actions={actions}
              />
            ),
          }))}
        />
      );
    case 'VStack':
    case 'HStack': {
      const Container = { VStack, HStack }[node.type];
      return (
        <Container spacing={node.spacing}>{node.children.map(renderChild)}</Container>
      );
    }
    case 'Grid':
      return (
        <Grid columns={node.columns} spacing={node.spacing}>
          {node.children.map(renderChild)}
        </Grid>
      );
    case 'Text': {
      const { type: _type, content, ...properties } = node;
      return typeof content === 'object' ? (
        <BoundText {...properties} reference={content} registry={registry} />
      ) : (
        <Text {...properties}>{content}</Text>
      );
    }
    case 'Button': {
      const { type: _type, action, ...properties } = node;
      return (
        <Button
          {...properties}
          onPress={() => {
            const handler = Object.hasOwn(actions, action)
              ? actions[action]
              : undefined;
            if (typeof handler === 'function') handler({ state: registry });
          }}
        />
      );
    }
    case 'Input':
      return <BoundInput node={node} registry={registry} />;
    case 'Toggle':
      return <BoundBoolean node={node} registry={registry} />;
    case 'DataTable':
      return <BoundDataTable node={node} registry={registry} />;
  }
}
