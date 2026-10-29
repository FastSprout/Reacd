import { editorToolbarNodeSchema } from '../editor-toolbar/index.js';
import { editorSuggestionMenuNodeSchema } from '../editor-suggestion-menu/index.js';
import { editorMentionMenuNodeSchema } from '../editor-mention-menu/index.js';
import { editorEmojiMenuNodeSchema } from '../editor-emoji-menu/index.js';
import { editorDragHandleNodeSchema } from '../editor-drag-handle/index.js';
import { selectMenuNodeSchema } from '../select-menu/generative.schema.js';
import { listboxNodeSchema } from '../listbox/generative.schema.js';
import { badgeNodeSchema } from '../badge/generative.schema.js';
import { localeSelectNodeSchema } from '../locale-select/generative.schema.js';
import { colorModeImageNodeSchema } from '../color-mode-image/generative.schema.js';
import { colorModeAvatarNodeSchema } from '../color-mode-avatar/generative.schema.js';
import { colorModeSelectNodeSchema } from '../color-mode-select/generative.schema.js';
import { colorModeSwitchNodeSchema } from '../color-mode-switch/generative.schema.js';
import { colorModeButtonNodeSchema } from '../color-mode-button/generative.schema.js';
import { chartNodeSchema } from '../chart/generative.schema.js';
import { marqueeNodeSchema } from '../marquee/generative.schema.js';
import { z } from 'zod';
import { inputMenuNodeSchema } from '../input-menu/generative.schema.js';
import { calendarNodeSchema } from '../calendar/generative.schema.js';
import { inputTimeNodeSchema } from '../input-time/generative.schema.js';
import { inputDateNodeSchema } from '../input-date/generative.schema.js';
import { chatAttachmentNodeSchema } from '../chat-attachment/generative.schema.js';
import { chatMessageNodeSchema } from '../chat-message/generative.schema.js';
import { chatMessagesNodeSchema } from '../chat-messages/generative.schema.js';
import { chatReasoningNodeSchema } from '../chat-reasoning/generative.schema.js';
import { chatToolNodeSchema } from '../chat-tool/generative.schema.js';
import { chatShimmerNodeSchema } from '../chat-shimmer/generative.schema.js';
import { iconNodeSchema } from '../icon/generative.schema.js';
import { alertNodeSchema } from '../alert/generative.schema.js';
import { progressNodeSchema } from '../progress/generative.schema.js';
import { toastNodeSchema } from '../toast/generative.schema.js';
import { contentNavigationNodeSchema }
  from '../content-navigation/generative.schema.js';
import { contentTocNodeSchema } from '../content-toc/generative.schema.js';
import { commandPaletteNodeSchema } from '../command-palette/generative.schema.js';
import { inputTagsNodeSchema } from '../input-tags/generative.schema.js';
import { treeNodeSchema } from '../tree/generative.schema.js';
import { navigationMenuNodeSchema } from '../navigation-menu/generative.schema.js';
import { linkNodeSchema } from '../link/generative.schema.js';
import { userNodeSchema } from '../user/generative.schema.js';
import { progressGroupNodeSchema } from '../progress-group/generative.schema.js';
import { inputNumberNodeSchema } from '../input-number/generative.schema.js';
import { pinInputNodeSchema } from '../pin-input/generative.schema.js';
import { timelineNodeSchema } from '../timeline/generative.schema.js';
import { inputRatingNodeSchema } from '../input-rating/generative.schema.js';
import { paginationNodeSchema } from '../pagination/generative.schema.js';
import { breadcrumbNodeSchema } from '../breadcrumb/generative.schema.js';
import { kbdNodeSchema } from '../kbd/generative.schema.js';
import { skeletonNodeSchema } from '../skeleton/generative.schema.js';
import { textComponentSchema } from '../text/text.schema.js';
import { buttonComponentSchema } from '../button/button.schema.js';
import { inputNodeSchema } from '../input/generative.schema.js';
import { switchNodeSchema } from '../switch/generative.schema.js';
import { textareaNodeSchema } from '../textarea/generative.schema.js';
import { submitButtonNodeSchema } from '../submit-button/generative.schema.js';
import { chatPromptSubmitNodeSchema } from
  '../chat-prompt-submit/generative.schema.js';
import { checkboxNodeSchema } from '../checkbox/generative.schema.js';
import { selectNodeSchema } from '../select/generative.schema.js';
import { colorPickerNodeSchema } from '../color-picker/generative.schema.js';
import { fileUploadNodeSchema } from '../file-upload/generative.schema.js';
import { toggleSchema } from '../toggle/toggle.schema.js';
import { sliderNodeSchema } from '../slider/generative.schema.js';
import { tableNodeSchema } from '../table/generative.schema.js';
export { tableNodeSchema } from '../table/generative.schema.js';
import { dataTableNodeSchema } from '../data-table/generative.schema.js';
import { radioGroupNodeSchema } from '../radio-group/generative.schema.js';
import { checkboxGroupNodeSchema } from '../checkbox-group/generative.schema.js';
import { avatarNodeSchema } from '../avatar/generative.schema.js';
import { avatarGroupNodeSchema } from '../avatar-group/generative.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  readStateBindingSchema,
  writeStateBindingSchema,
} from '../state/binding.schema.js';

const { children, ...textShape } = textComponentSchema.shape;
export const textNodeSchema = z.strictObject({
  ...textShape,
  type: z.literal('Text'),
  content: z.union([children, readStateBindingSchema]),
});
const { onPress: _onPress, ...buttonShape } = buttonComponentSchema.shape;
export const buttonNodeSchema = z.strictObject({
  ...buttonShape,
  type: z.literal('Button'),
  action: stateKeySchema,
});
export { inputNodeSchema } from '../input/generative.schema.js';
export { checkboxNodeSchema } from '../checkbox/generative.schema.js';
const {
  onCheckedChange: _toggleChange,
  checked: _toggleValue,
  ...toggleShape
} = toggleSchema.shape;
export const toggleNodeSchema = z.strictObject({
  ...toggleShape,
  type: z.literal('Toggle'),
  checked: writeStateBindingSchema,
});
export { sliderNodeSchema } from '../slider/generative.schema.js';

export const leafNodeSchemas = [
  editorToolbarNodeSchema,
  editorSuggestionMenuNodeSchema,
  editorMentionMenuNodeSchema,
  editorEmojiMenuNodeSchema,
  editorDragHandleNodeSchema,
  selectMenuNodeSchema,
  listboxNodeSchema,
  badgeNodeSchema,
  selectNodeSchema,
  colorPickerNodeSchema,
  fileUploadNodeSchema,
  inputMenuNodeSchema,
  switchNodeSchema,
  textareaNodeSchema,
  submitButtonNodeSchema,
  chatPromptSubmitNodeSchema,
  localeSelectNodeSchema,
  colorModeImageNodeSchema,
  colorModeAvatarNodeSchema,
  colorModeSelectNodeSchema,
  colorModeSwitchNodeSchema,
  colorModeButtonNodeSchema,
  chartNodeSchema,
  marqueeNodeSchema,
  calendarNodeSchema,
  inputTimeNodeSchema,
  inputDateNodeSchema,
  chatAttachmentNodeSchema,
  chatMessageNodeSchema,
  chatMessagesNodeSchema,
  chatReasoningNodeSchema,
  chatToolNodeSchema,
  chatShimmerNodeSchema,
  iconNodeSchema,
  alertNodeSchema,
  toastNodeSchema,
  contentNavigationNodeSchema,
  contentTocNodeSchema,
  contentSurroundNodeSchema,
  contentSearchButtonNodeSchema,
  dropdownMenuNodeSchema,
  commandPaletteNodeSchema,
  inputTagsNodeSchema,
  treeNodeSchema,
  navigationMenuNodeSchema,
  linkNodeSchema,
  inputRatingNodeSchema,
  timelineNodeSchema,
  userNodeSchema,
  progressGroupNodeSchema,
  inputNumberNodeSchema,
  pinInputNodeSchema,
  paginationNodeSchema,
  breadcrumbNodeSchema,
  skeletonNodeSchema,
  kbdNodeSchema,
  avatarNodeSchema,
  avatarGroupNodeSchema,
  radioGroupNodeSchema,
  checkboxGroupNodeSchema,
  textNodeSchema,
  buttonNodeSchema,
  inputNodeSchema,
  checkboxNodeSchema,
  toggleNodeSchema,
  sliderNodeSchema,
  progressNodeSchema,
  tableNodeSchema,
  dataTableNodeSchema,
] as const;
export type GenerativeLeaf = z.infer<(typeof leafNodeSchemas)[number]>;
import { dropdownMenuNodeSchema } from '../dropdown-menu/generative.schema.js';
import { contentSurroundNodeSchema } from '../content-surround/generative.schema.js';
import { contentSearchButtonNodeSchema } from
  '../content-search-button/generative.schema.js';
