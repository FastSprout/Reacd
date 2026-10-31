import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { contentSurroundSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-surround/index.js';
import { ShadcnContentSurround } from '../content-surround/content-surround.adapter.js';
import { paginationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pagination/pagination.schema.js';
import { breadcrumbSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/breadcrumb/breadcrumb.schema.js';
import { ShadcnPagination } from '../pagination/pagination.adapter.js';
import { ShadcnBreadcrumb } from '../breadcrumb/breadcrumb.adapter.js';
import { skeletonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/skeleton/skeleton.schema.js';
import { emptySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/empty/empty.schema.js';
import { ShadcnSkeleton } from '../skeleton/skeleton.adapter.js';
import { ShadcnEmpty } from '../empty/empty.adapter.js';
import { kbdSchema } from '@fastsprout/reacd/adapter-runtime/schema/kbd/kbd.schema.js';
import { popoverSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/popover/popover.schema.js';
import { ShadcnKbd } from '../kbd/kbd.adapter.js';
import { ShadcnPopover } from '../popover/popover.adapter.js';
import { chipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chip/chip.schema.js';
import { tooltipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tooltip/tooltip.schema.js';
import { ShadcnChip } from '../chip/chip.adapter.js';
import { ShadcnTooltip } from '../tooltip/tooltip.adapter.js';
import { avatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar/avatar.schema.js';
import { avatarGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar-group/index.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';
import { ShadcnAvatarGroup } from '../avatar-group/avatar-group.adapter.js';
import { collapsibleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/collapsible/collapsible.schema.js';
import { ShadcnCollapsible } from '../collapsible/collapsible.adapter.js';
import { modalSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/modal/modal.schema.js';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { accordionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/accordion/accordion.schema.js';
import { ShadcnAccordion } from '../accordion/accordion.adapter.js';
import { badgeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/badge/badge.schema.js';
import { alertSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/alert/alert.schema.js';
import { progressSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/progress/progress.schema.js';
import { spinnerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/spinner/spinner.schema.js';
import { tabsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tabs/tabs.schema.js';
import { navigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation/navigation.schema.js';
import { linkSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/link/link.schema.js';
import { codeBlockSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/code-block/code-block.schema.js';
import { tableDeclarationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/table/table.schema.js';
import { dataTableComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/index.js';
import { ShadcnDataTable } from '../data-table/data-table.adapter.js';
import { ShadcnBadge } from '../badge/badge.adapter.js';
import { ShadcnAlert } from '../alert/alert.adapter.js';
import { ShadcnProgress } from '../progress/progress.adapter.js';
import { SpinnerSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/spinner/spinner.renderer.js';
import { ShadcnTabs } from '../tabs/tabs.adapter.js';
import { ShadcnNavigation } from '../navigation/navigation.adapter.js';
import { LinkSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/link/link.renderer.js';
import { CodeBlockSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/code-block/code-block.renderer.js';
import { ShadcnTable } from '../table/table.adapter.js';

export const contentEntries = {
  ContentSurround: renderEntry(
    'ContentSurround',
    contentSurroundSchema,
    ShadcnContentSurround,
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
