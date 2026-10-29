import type { EditorNode } from '../editor/generative.schema.js';
import type { CarouselNode } from '../carousel/generative.schema.js';
import type { AuthFormNode } from '../auth-form/generative.schema.js';
import type { FieldGroupNode } from '../field-group/generative.schema.js';
import type { CardNode } from '../card/generative.schema.js';
import type { PageLogosNode } from '../page-logos/generative.schema.js';
import type { FooterColumnsNode } from '../footer-columns/generative.schema.js';
import type { StepperNode } from '../stepper/generative.schema.js';
import type { PageHeaderNode } from '../page-header/generative.schema.js';
import type { PageFeatureNode } from '../page-feature/generative.schema.js';
import type { PageCardNode } from '../page-card/generative.schema.js';
import type { PageHeroNode } from '../page-hero/generative.schema.js';
import type { PageSectionNode } from '../page-section/generative.schema.js';
import type { Spacing } from '../../core/policy.js';
import type { GenerativeLeaf } from './leaf-nodes.schema.js';
import type { AccordionNode } from '../accordion/generative.schema.js';
import type { ModalNode } from '../modal/generative.schema.js';
import type { CollapsibleNode } from '../collapsible/generative.schema.js';
import type { ChipNode } from '../chip/generative.schema.js';
import type { TooltipNode } from '../tooltip/generative.schema.js';
import type { PopoverNode } from '../popover/generative.schema.js';
import type { EmptyNode } from '../empty/generative.schema.js';
import type { TabsNode } from '../tabs/generative.schema.js';
import type { PageAsideNode } from '../page-aside/generative.schema.js';
import type { PageBodyNode } from '../page-body/generative.schema.js';
import type { PageColumnsNode } from '../page-columns/generative.schema.js';
import type { PageGridNode } from '../page-grid/generative.schema.js';
import type { PageListNode } from '../page-list/generative.schema.js';
import type { ContainerNode } from '../container/generative.schema.js';
import type { MainNode } from '../main/generative.schema.js';
import type { HeaderNode } from '../header/generative.schema.js';
import type { FooterNode } from '../footer/generative.schema.js';
import type { SeparatorNode } from '../separator/generative.schema.js';
import type { BannerNode } from '../banner/generative.schema.js';
import type { AppNode } from '../app/generative.schema.js';
import type { ErrorNode } from '../error/generative.schema.js';
import type { ThemeNode } from '../theme/generative.schema.js';
import type { ScrollAreaNode } from '../scroll-area/generative.schema.js';

export type GenerativeNode =
  | EditorNode<GenerativeNode>
  | FormNode<GenerativeNode>
  | FormFieldNode<GenerativeNode>
  | ChatPromptNode<GenerativeNode>
  | ChatPaletteNode<GenerativeNode>
  | CarouselNode<GenerativeNode>
  | FieldGroupNode<GenerativeNode>
  | CardNode<GenerativeNode>
  | AuthFormNode<GenerativeNode>
  | PageLogosNode
  | ContentSearchNode<GenerativeNode>
  | PricingPlanNode<GenerativeNode>
  | PricingPlansNode<GenerativeNode>
  | PricingTableNode<GenerativeNode>
  | DashboardGroupNode<GenerativeNode>
  | DashboardSidebarNode<GenerativeNode>
  | DashboardPanelNode<GenerativeNode>
  | DashboardNavbarNode<GenerativeNode>
  | DashboardToolbarNode<GenerativeNode>
  | DashboardLeaf
  | BlogPostNode<GenerativeNode>
  | BlogPostsNode<GenerativeNode>
  | ChangelogVersionNode<GenerativeNode>
  | ChangelogVersionsNode<GenerativeNode>
  | DrawerNode<GenerativeNode>
  | SlideoverNode<GenerativeNode>
  | ContextMenuNode<GenerativeNode>
  | SidebarNode<GenerativeNode>
  | SplitterNode<GenerativeNode>
  | PageNode<GenerativeNode>
  | SectionNode<GenerativeNode>
  | PageCTANode<GenerativeNode>
  | PageAnchorsNode<GenerativeNode>
  | PageLinksNode<GenerativeNode>
  | FooterColumnsNode<GenerativeNode>
  | StepperNode<GenerativeNode>
  | PageHeaderNode<GenerativeNode>
  | PageFeatureNode<GenerativeNode>
  | PageCardNode<GenerativeNode>
  | PageHeroNode<GenerativeNode>
  | PageSectionNode<GenerativeNode>
  | TabsNode<GenerativeNode>
  | PageAsideNode<GenerativeNode>
  | PageBodyNode<GenerativeNode>
  | PageColumnsNode<GenerativeNode>
  | PageGridNode<GenerativeNode>
  | PageListNode<GenerativeNode>
  | GenerativeLeaf
  | AppNode<GenerativeNode>
  | ErrorNode<GenerativeNode>
  | ThemeNode<GenerativeNode>
  | ScrollAreaNode<GenerativeNode>
  | ContainerNode<GenerativeNode>
  | MainNode<GenerativeNode>
  | HeaderNode<GenerativeNode>
  | FooterNode<GenerativeNode>
  | SeparatorNode<GenerativeNode>
  | BannerNode<GenerativeNode>
  | EmptyNode<GenerativeNode>
  | ChipNode<GenerativeNode>
  | TooltipNode<GenerativeNode>
  | PopoverNode<GenerativeNode>
  | AccordionNode<GenerativeNode>
  | ModalNode<GenerativeNode>
  | CollapsibleNode<GenerativeNode>
  | {
      type: 'VStack' | 'HStack';
      spacing?: Spacing | undefined;
      children: GenerativeNode[];
    }
  | {
      type: 'Grid';
      spacing?: Spacing | undefined;
      columns: number;
      children: GenerativeNode[];
    };
import type { SidebarNode } from '../sidebar/generative.schema.js';
import type { DashboardGroupNode } from '../dashboard-group/generative.schema.js';
import type { DashboardSidebarNode } from '../dashboard-sidebar/generative.schema.js';
import type { DashboardPanelNode } from '../dashboard-panel/generative.schema.js';
import type { DashboardNavbarNode } from '../dashboard-navbar/generative.schema.js';
import type { DashboardToolbarNode } from '../dashboard-toolbar/generative.schema.js';
import type { DashboardLeaf } from './dashboard-nodes.schema.js';
import type { BlogPostNode } from '../blog-post/generative.schema.js';
import type { BlogPostsNode } from '../blog-posts/generative.schema.js';
import type { ChangelogVersionNode } from
  '../changelog-version/generative.schema.js';
import type { ChangelogVersionsNode } from
  '../changelog-versions/generative.schema.js';
import type { DrawerNode } from '../drawer/generative.schema.js';
import type { SlideoverNode } from '../slideover/generative.schema.js';
import type { ContextMenuNode } from '../context-menu/generative.schema.js';
import type { SplitterNode } from '../splitter/generative.schema.js';
import type { PageNode } from '../page/generative.schema.js';
import type { SectionNode } from '../section/generative.schema.js';
import type { PageCTANode } from '../page-cta/generative.schema.js';
import type { PageAnchorsNode } from '../page-anchors/generative.schema.js';
import type { PageLinksNode } from '../page-links/generative.schema.js';
import type { PricingPlanNode } from '../pricing-plan/generative.schema.js';
import type { PricingPlansNode } from '../pricing-plans/generative.schema.js';
import type { PricingTableNode } from '../pricing-table/generative.schema.js';
import type { ContentSearchNode } from '../content-search/generative.schema.js';
import type { FormNode } from '../form/generative.schema.js';
import type { FormFieldNode } from '../form-field/generative.schema.js';
import type { ChatPromptNode } from '../chat-prompt/generative.schema.js';
import type { ChatPaletteNode } from '../chat-palette/generative.schema.js';
