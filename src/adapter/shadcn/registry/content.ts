import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { contentSurroundSchema } from '../../../schema/content-surround/index.js';
import { ShadcnContentSurround } from
  '../content-surround/content-surround.adapter.js';
import { paginationSchema } from '../../../schema/pagination/pagination.schema.js';
import { breadcrumbSchema } from '../../../schema/breadcrumb/breadcrumb.schema.js';
import { ShadcnPagination } from '../pagination/pagination.adapter.js';
import { ShadcnBreadcrumb } from '../breadcrumb/breadcrumb.adapter.js';
import { skeletonSchema } from '../../../schema/skeleton/skeleton.schema.js';
import { emptySchema } from '../../../schema/empty/empty.schema.js';
import { ShadcnSkeleton } from '../skeleton/skeleton.adapter.js';
import { ShadcnEmpty } from '../empty/empty.adapter.js';
import { kbdSchema } from '../../../schema/kbd/kbd.schema.js';
import { popoverSchema } from '../../../schema/popover/popover.schema.js';
import { ShadcnKbd } from '../kbd/kbd.adapter.js';
import { ShadcnPopover } from '../popover/popover.adapter.js';
import { chipSchema } from '../../../schema/chip/chip.schema.js';
import { tooltipSchema } from '../../../schema/tooltip/tooltip.schema.js';
import { ShadcnChip } from '../chip/chip.adapter.js';
import { ShadcnTooltip } from '../tooltip/tooltip.adapter.js';
import { avatarSchema } from '../../../schema/avatar/avatar.schema.js';
import { avatarGroupSchema } from '../../../schema/avatar-group/index.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';
import { ShadcnAvatarGroup } from '../avatar-group/avatar-group.adapter.js';
import { collapsibleSchema } from '../../../schema/collapsible/collapsible.schema.js';
import { ShadcnCollapsible } from '../collapsible/collapsible.adapter.js';
import { modalSchema } from '../../../schema/modal/modal.schema.js';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { accordionSchema } from '../../../schema/accordion/accordion.schema.js';
import { ShadcnAccordion } from '../accordion/accordion.adapter.js';
import { badgeSchema } from '../../../schema/badge/badge.schema.js';
import { alertSchema } from '../../../schema/alert/alert.schema.js';
import { progressSchema } from '../../../schema/progress/progress.schema.js';
import { spinnerSchema } from '../../../schema/spinner/spinner.schema.js';
import { tabsSchema } from '../../../schema/tabs/tabs.schema.js';
import { navigationSchema } from '../../../schema/navigation/navigation.schema.js';
import { linkSchema } from '../../../schema/link/link.schema.js';
import { codeBlockSchema } from '../../../schema/code-block/code-block.schema.js';
import { tableDeclarationSchema } from '../../../schema/table/table.schema.js';
import { dataTableComponentSchema } from '../../../schema/data-table/index.js';
import { ShadcnDataTable } from '../data-table/data-table.adapter.js';
import { ShadcnBadge } from '../badge/badge.adapter.js';
import { ShadcnAlert } from '../alert/alert.adapter.js';
import { ShadcnProgress } from '../progress/progress.adapter.js';
import { SpinnerSurface } from '../../../renderer/spinner/spinner.renderer.js';
import { ShadcnTabs } from '../tabs/tabs.adapter.js';
import { ShadcnNavigation } from '../navigation/navigation.adapter.js';
import { LinkSurface } from '../../../renderer/link/link.renderer.js';
import { CodeBlockSurface } from '../../../renderer/code-block/code-block.renderer.js';
import { ShadcnTable } from '../table/table.adapter.js';

export const contentEntries = {
  ContentSurround: renderEntry(
    'ContentSurround', contentSurroundSchema, ShadcnContentSurround,
  ),
  Pagination: renderEntry('Pagination', paginationSchema, ShadcnPagination),
  Breadcrumb: renderEntry('Breadcrumb', breadcrumbSchema, ShadcnBreadcrumb),
  Skeleton: renderEntry('Skeleton', skeletonSchema, ShadcnSkeleton),
  Empty: renderEntry('Empty', emptySchema, ShadcnEmpty),
  Kbd: renderEntry('Kbd', kbdSchema, ShadcnKbd),
  Popover: renderEntry('Popover', popoverSchema, ShadcnPopover),
  Chip: renderEntry('Chip', chipSchema, ShadcnChip),
  Tooltip: renderEntry('Tooltip', tooltipSchema, ShadcnTooltip),
  Avatar: renderEntry('Avatar', avatarSchema, ShadcnAvatar),
  AvatarGroup: renderEntry('AvatarGroup', avatarGroupSchema, ShadcnAvatarGroup),
  Collapsible: renderEntry('Collapsible', collapsibleSchema, ShadcnCollapsible),
  Modal: renderEntry('Modal', modalSchema, ShadcnModal),
  Accordion: renderEntry('Accordion', accordionSchema, ShadcnAccordion),
  Badge: renderEntry('Badge', badgeSchema, ShadcnBadge),
  Alert: renderEntry('Alert', alertSchema, ShadcnAlert),
  Progress: renderEntry('Progress', progressSchema, ShadcnProgress),
  Spinner: renderEntry('Spinner', spinnerSchema, SpinnerSurface),
  Tabs: renderEntry('Tabs', tabsSchema, ShadcnTabs),
  Navigation: renderEntry('Navigation', navigationSchema, ShadcnNavigation),
  Link: renderEntry('Link', linkSchema, LinkSurface),
  CodeBlock: renderEntry('CodeBlock', codeBlockSchema, CodeBlockSurface),
  Table: renderEntry('Table', tableDeclarationSchema, ShadcnTable),
  DataTable: renderEntry('DataTable', dataTableComponentSchema, ShadcnDataTable),
};
