import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { contentSurroundSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-surround/index.js';
import { MuiContentSurround } from '../content-surround/content-surround.adapter.js';
import { paginationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pagination/pagination.schema.js';
import { breadcrumbSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/breadcrumb/breadcrumb.schema.js';
import { MuiPagination } from '../pagination/pagination.adapter.js';
import { MuiBreadcrumb } from '../breadcrumb/breadcrumb.adapter.js';
import { skeletonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/skeleton/skeleton.schema.js';
import { emptySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/empty/empty.schema.js';
import { MuiSkeleton } from '../skeleton/skeleton.adapter.js';
import { MuiEmpty } from '../empty/empty.adapter.js';
import { kbdSchema } from '@fastsprout/reacd/adapter-runtime/schema/kbd/kbd.schema.js';
import { popoverSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/popover/popover.schema.js';
import { MuiKbd } from '../kbd/kbd.adapter.js';
import { MuiPopover } from '../popover/popover.adapter.js';
import { chipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chip/chip.schema.js';
import { tooltipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tooltip/tooltip.schema.js';
import { MuiChip } from '../chip/chip.adapter.js';
import { MuiTooltip } from '../tooltip/tooltip.adapter.js';
import { avatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar/avatar.schema.js';
import { avatarGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar-group/index.js';
import { MuiAvatar } from '../avatar/avatar.adapter.js';
import { MuiAvatarGroup } from '../avatar-group/avatar-group.adapter.js';
import { collapsibleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/collapsible/collapsible.schema.js';
import { MuiCollapsible } from '../collapsible/collapsible.adapter.js';
import { modalSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/modal/modal.schema.js';
import { MuiModal } from '../modal/modal.adapter.js';
import { accordionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/accordion/accordion.schema.js';
import { MuiAccordion } from '../accordion/accordion.adapter.js';
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
import { MuiDataTable } from '../data-table/data-table.adapter.js';
import { MuiBadge } from '../badge/badge.adapter.js';
import { MuiAlert } from '../alert/alert.adapter.js';
import { MuiProgress } from '../progress/progress.adapter.js';
import { SpinnerSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/spinner/spinner.renderer.js';
import { MuiTabs } from '../tabs/tabs.adapter.js';
import { MuiNavigation } from '../navigation/navigation.adapter.js';
import { LinkSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/link/link.renderer.js';
import { CodeBlockSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/code-block/code-block.renderer.js';
import { MuiTable } from '../table/table.adapter.js';

export const contentEntries = {
  ContentSurround: renderEntry(
    'ContentSurround',
    contentSurroundSchema,
    MuiContentSurround,
  ),
  Pagination: renderEntry('Pagination', paginationSchema, MuiPagination),
  Breadcrumb: renderEntry('Breadcrumb', breadcrumbSchema, MuiBreadcrumb),
  Skeleton: renderEntry('Skeleton', skeletonSchema, MuiSkeleton),
  Empty: renderEntry('Empty', emptySchema, MuiEmpty),
  Kbd: renderEntry('Kbd', kbdSchema, MuiKbd),
  Popover: renderEntry('Popover', popoverSchema, MuiPopover),
  Chip: renderEntry('Chip', chipSchema, MuiChip),
  Tooltip: renderEntry('Tooltip', tooltipSchema, MuiTooltip),
  Avatar: renderEntry('Avatar', avatarSchema, MuiAvatar),
  AvatarGroup: renderEntry('AvatarGroup', avatarGroupSchema, MuiAvatarGroup),
  Collapsible: renderEntry('Collapsible', collapsibleSchema, MuiCollapsible),
  Modal: renderEntry('Modal', modalSchema, MuiModal),
  Accordion: renderEntry('Accordion', accordionSchema, MuiAccordion),
  Badge: renderEntry('Badge', badgeSchema, MuiBadge),
  Alert: renderEntry('Alert', alertSchema, MuiAlert),
  Progress: renderEntry('Progress', progressSchema, MuiProgress),
  Spinner: renderEntry('Spinner', spinnerSchema, SpinnerSurface),
  Tabs: renderEntry('Tabs', tabsSchema, MuiTabs),
  Navigation: renderEntry('Navigation', navigationSchema, MuiNavigation),
  Link: renderEntry('Link', linkSchema, LinkSurface),
  CodeBlock: renderEntry('CodeBlock', codeBlockSchema, CodeBlockSurface),
  Table: renderEntry('Table', tableDeclarationSchema, MuiTable),
  DataTable: renderEntry('DataTable', dataTableComponentSchema, MuiDataTable),
};
