import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { formSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form/form.schema.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { submitButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/submit-button/submit-button.schema.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { alertSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/alert/alert.schema.js';
import { ShadcnAlert } from '../alert/alert.adapter.js';
import { badgeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/badge/badge.schema.js';
import { ShadcnBadge } from '../badge/badge.adapter.js';
import { dividerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/divider/divider.schema.js';
import { ShadcnDivider } from '../divider/divider.adapter.js';
import { iconSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/icon/icon.schema.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';
import { skeletonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/skeleton/skeleton.schema.js';
import { ShadcnSkeleton } from '../skeleton/skeleton.adapter.js';
import { tableDeclarationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/table/table.schema.js';
import { ShadcnTable } from '../table/table.adapter.js';
import { dataTableComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/data-table.schema.js';
import { ShadcnDataTable } from '../data-table/data-table.adapter.js';

import { colorModeButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-button/index.js';
import { ShadcnColorModeButton } from
  '../color-mode-button/color-mode-button.adapter.js';
import { colorModeSwitchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-switch/index.js';
import { ShadcnColorModeSwitch } from
  '../color-mode-switch/color-mode-switch.adapter.js';
import { colorModeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-select/index.js';
import { ShadcnColorModeSelect } from
  '../color-mode-select/color-mode-select.adapter.js';
import { colorModeAvatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-avatar/index.js';
import { ShadcnColorModeAvatar } from
  '../color-mode-avatar/color-mode-avatar.adapter.js';
import { colorModeImageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode-image/index.js';
import { ShadcnColorModeImage } from '../color-mode-image/color-mode-image.adapter.js';
import { avatarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar/avatar.schema.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';

import { avatarGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/avatar-group/index.js';
import { ShadcnAvatarGroup } from '../avatar-group/avatar-group.adapter.js';
import { linkSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/link/link.schema.js';
import { ShadcnLink } from '../link/link.adapter.js';
import { tooltipSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tooltip/tooltip.schema.js';
import { ShadcnTooltip } from '../tooltip/tooltip.adapter.js';
import { formFieldSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-field/index.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { emptySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/empty/empty.schema.js';
import { ShadcnEmpty } from '../empty/empty.adapter.js';
import { errorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/error/error.schema.js';
import { ShadcnError } from '../error/error.adapter.js';
import { bannerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/banner/banner.schema.js';
import { ShadcnBanner } from '../banner/banner.adapter.js';

export const nativeContentEntries = {
  Empty: renderEntry('Empty', emptySchema, ShadcnEmpty),
  Error: renderEntry('Error', errorSchema, ShadcnError),
  Banner: renderEntry('Banner', bannerSchema, ShadcnBanner),
  AvatarGroup: renderEntry('AvatarGroup', avatarGroupSchema, ShadcnAvatarGroup),
  Link: renderEntry('Link', linkSchema, ShadcnLink),
  Tooltip: renderEntry('Tooltip', tooltipSchema, ShadcnTooltip),
  FormField: renderEntry('FormField', formFieldSchema, ShadcnFormField),
  ColorModeButton: renderEntry(
    'ColorModeButton', colorModeButtonSchema, ShadcnColorModeButton,
  ),
  ColorModeSwitch: renderEntry(
    'ColorModeSwitch', colorModeSwitchSchema, ShadcnColorModeSwitch,
  ),
  ColorModeSelect: renderEntry(
    'ColorModeSelect', colorModeSelectSchema, ShadcnColorModeSelect,
  ),
  ColorModeAvatar: renderEntry(
    'ColorModeAvatar', colorModeAvatarSchema, ShadcnColorModeAvatar,
  ),
  ColorModeImage: renderEntry(
    'ColorModeImage', colorModeImageSchema, ShadcnColorModeImage,
  ),
  Avatar: renderEntry(
    'Avatar', avatarSchema, ShadcnAvatar,
  ),
  Form: renderEntry('Form', formSchema, ShadcnForm),
  SubmitButton: renderEntry('SubmitButton', submitButtonSchema, ShadcnSubmitButton),
  Alert: renderEntry('Alert', alertSchema, ShadcnAlert),
  Badge: renderEntry('Badge', badgeSchema, ShadcnBadge),
  Divider: renderEntry('Divider', dividerSchema, ShadcnDivider),
  Icon: renderEntry('Icon', iconSchema, ShadcnIcon),
  Skeleton: renderEntry('Skeleton', skeletonSchema, ShadcnSkeleton),
  Table: renderEntry('Table', tableDeclarationSchema, ShadcnTable),
  DataTable: renderEntry('DataTable', dataTableComponentSchema, ShadcnDataTable),
};
