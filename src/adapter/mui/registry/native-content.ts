import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { formSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form/form.schema.js';
import { MuiForm } from '../form/form.adapter.js';
import { submitButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/submit-button/submit-button.schema.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { alertSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/alert/alert.schema.js';
import { MuiAlert } from '../alert/alert.adapter.js';
import { tableDeclarationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/table/table.schema.js';
import { MuiTable } from '../table/table.adapter.js';
import { dataTableComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/data-table.schema.js';
import { MuiDataTable } from '../data-table/data-table.adapter.js';
import { avatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar/avatar.schema.js';
import { MuiAvatar } from '../avatar/avatar.adapter.js';
import { badgeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/badge/badge.schema.js';
import { MuiBadge } from '../badge/badge.adapter.js';
import { linkSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/link/link.schema.js';
import { MuiLink } from '../link/link.adapter.js';
import { dividerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/divider/divider.schema.js';
import { MuiDivider } from '../divider/divider.adapter.js';
import { tooltipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tooltip/tooltip.schema.js';
import { MuiTooltip } from '../tooltip/tooltip.adapter.js';
import { navigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation/navigation.schema.js';
import { MuiNavigation } from '../navigation/navigation.adapter.js';
import { collapsibleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/collapsible/collapsible.schema.js';
import { MuiCollapsible } from '../collapsible/collapsible.adapter.js';
import { codeBlockSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/code-block/code-block.schema.js';
import { MuiCodeBlock } from '../code-block/code-block.adapter.js';
import { avatarGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar-group/avatar-group.schema.js';
import { MuiAvatarGroup } from '../avatar-group/avatar-group.adapter.js';
import { inputNumberSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-number/input-number.schema.js';
import { MuiInputNumber } from '../input-number/input-number.adapter.js';

import { colorModeButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-button/index.js';
import { MuiColorModeButton } from '../color-mode-button/color-mode-button.adapter.js';
import { colorModeSwitchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-switch/index.js';
import { MuiColorModeSwitch } from '../color-mode-switch/color-mode-switch.adapter.js';
import { colorModeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-select/index.js';
import { MuiColorModeSelect } from '../color-mode-select/color-mode-select.adapter.js';
import { colorModeAvatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-avatar/index.js';
import { MuiColorModeAvatar } from '../color-mode-avatar/color-mode-avatar.adapter.js';
import { colorModeImageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-image/index.js';
import { MuiColorModeImage } from '../color-mode-image/color-mode-image.adapter.js';

import { formFieldSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-field/form-field.schema.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { skeletonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/skeleton/skeleton.schema.js';
import { MuiSkeleton } from '../skeleton/skeleton.adapter.js';
import { paginationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pagination/pagination.schema.js';
import { MuiPagination } from '../pagination/pagination.adapter.js';

import { imageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/image/index.js';
import { MuiImage } from '../image/image.adapter.js';

export const nativeContentEntries = {
  Image: renderEntry('Image', imageSchema, MuiImage),
  ColorModeButton: renderEntry(
    'ColorModeButton',
    colorModeButtonSchema,
    MuiColorModeButton,
  ),
  ColorModeSwitch: renderEntry(
    'ColorModeSwitch',
    colorModeSwitchSchema,
    MuiColorModeSwitch,
  ),
  ColorModeSelect: renderEntry(
    'ColorModeSelect',
    colorModeSelectSchema,
    MuiColorModeSelect,
  ),
  ColorModeAvatar: renderEntry(
    'ColorModeAvatar',
    colorModeAvatarSchema,
    MuiColorModeAvatar,
  ),
  ColorModeImage: renderEntry(
    'ColorModeImage',
    colorModeImageSchema,
    MuiColorModeImage,
  ),
  Form: renderEntry('Form', formSchema, MuiForm),
  SubmitButton: renderEntry('SubmitButton', submitButtonSchema, MuiSubmitButton),
  Alert: renderEntry('Alert', alertSchema, MuiAlert),
  Table: renderEntry('Table', tableDeclarationSchema, MuiTable),
  DataTable: renderEntry('DataTable', dataTableComponentSchema, MuiDataTable),
  Avatar: renderEntry('Avatar', avatarSchema, MuiAvatar),
  Badge: renderEntry('Badge', badgeSchema, MuiBadge),
  Link: renderEntry('Link', linkSchema, MuiLink),
  Divider: renderEntry('Divider', dividerSchema, MuiDivider),
  Tooltip: renderEntry('Tooltip', tooltipSchema, MuiTooltip),
  Navigation: renderEntry('Navigation', navigationSchema, MuiNavigation),
  Collapsible: renderEntry('Collapsible', collapsibleSchema, MuiCollapsible),
  CodeBlock: renderEntry('CodeBlock', codeBlockSchema, MuiCodeBlock),
  AvatarGroup: renderEntry('AvatarGroup', avatarGroupSchema, MuiAvatarGroup),
  InputNumber: renderEntry('InputNumber', inputNumberSchema, MuiInputNumber),
  FormField: renderEntry('FormField', formFieldSchema, MuiFormField),
  Skeleton: renderEntry('Skeleton', skeletonSchema, MuiSkeleton),
  Pagination: renderEntry('Pagination', paginationSchema, MuiPagination),
};
