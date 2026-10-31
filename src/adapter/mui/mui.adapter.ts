import { editorEntries } from './registry/editor.js';
import { editorMenuEntries } from './registry/editor-menus.js';
import { editorDragHandleEntries } from './registry/editor-drag-handle.js';
import { listboxEntries } from './registry/listbox.js';
import { colorModeEntries } from './registry/color-mode.js';
import { chartEntries } from './registry/chart.js';
import { marqueeEntries } from './registry/marquee.js';
import { carouselEntries } from './registry/carousel.js';
import { authFormEntries } from './registry/auth-form.js';
import { toastEntries } from './registry/toast.js';
import { calendarEntries } from './registry/calendar.js';
import { chatEntries } from './registry/chat.js';
import { elementEntries } from './registry/element.js';
import { chatFeedbackEntries } from './registry/chat-feedback.js';
import { contentOutlineEntries } from './registry/content-outline.js';
import { pageLogosEntries } from './registry/page-logos.js';
import { vStackSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/v-stack/v-stack.schema.js';
import { hStackSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/h-stack/h-stack.schema.js';
import { cardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/card/card.schema.js';
import { gridSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/grid/grid.schema.js';
import { textComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/text/text.schema.js';
import { buttonComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/button/button.schema.js';
import { inputComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input/input.schema.js';
import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { defineThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/validate-adapter.js';
import { MuiSurface } from './surface/surface.adapter.js';
import { MuiVStack } from './v-stack/v-stack.adapter.js';
import { MuiHStack } from './h-stack/h-stack.adapter.js';
import { MuiCard } from './card/card.adapter.js';
import { MuiGrid } from './grid/grid.adapter.js';
import { MuiText } from './text/text.adapter.js';
import { MuiButton } from './button/button.adapter.js';
import { MuiInput } from './input/input.adapter.js';
import { fieldEntries } from './registry/fields.js';
import { structureEntries } from './registry/structure.js';
import { contentEntries } from './registry/content.js';
import { shellEntries } from './registry/shells.js';
import { feedbackEntries } from './registry/feedback.js';
import { pageCompositionEntries } from './registry/page-composition.js';
import { pagePresentationEntries } from './registry/page-presentation.js';
import { navigationCompositionEntries } from './registry/navigation-composition.js';
import { sidebarSplitterEntries } from './registry/sidebar-splitter.js';
import { pageNavigationEntries } from './registry/page-navigation.js';
import { commandPaletteEntries } from './registry/command-palette.js';
import { dashboardEntries } from './registry/dashboard.js';
import { editorialEntries } from './registry/editorial.js';
import { contentSearchEntries } from './registry/content-search.js';
import { pricingEntries } from './registry/pricing.js';
import { edgePanelEntries } from './registry/edge-panels.js';
import { actionMenuEntries } from './registry/action-menus.js';

import type { ThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';

export const muiAdapter: ThemeAdapter = defineThemeAdapter({
  id: 'material-ui',
  Surface: MuiSurface,
  components: {
    ...editorEntries,
    ...editorMenuEntries,
    ...editorDragHandleEntries,
    ...listboxEntries,
    ...colorPickerEntries,
    ...fileUploadEntries,
    ...chatComposerEntries,
    ...colorModeEntries,
    ...chartEntries,
    ...marqueeEntries,
    ...carouselEntries,
    ...calendarEntries,
    ...chatEntries,
    ...elementEntries,
    ...chatFeedbackEntries,
    ...toastEntries,
    ...contentOutlineEntries,
    ...authFormEntries,
    ...pageLogosEntries,
    ...fieldEntries,
    ...structureEntries,
    ...contentEntries,
    ...shellEntries,
    ...feedbackEntries,
    ...pageCompositionEntries,
    ...pagePresentationEntries,
    ...navigationCompositionEntries,
    ...sidebarSplitterEntries,
    ...pageNavigationEntries,
    ...commandPaletteEntries,
    ...dashboardEntries,
    ...editorialEntries,
    ...contentSearchEntries,
    ...pricingEntries,
    ...edgePanelEntries,
    ...actionMenuEntries,
    VStack: renderEntry('VStack', vStackSchema, MuiVStack),
    HStack: renderEntry('HStack', hStackSchema, MuiHStack),
    Card: renderEntry('Card', cardSchema, MuiCard),
    Grid: renderEntry('Grid', gridSchema, MuiGrid),
    Text: renderEntry('Text', textComponentSchema, MuiText),
    Button: renderEntry('Button', buttonComponentSchema, MuiButton),
    Input: renderEntry('Input', inputComponentSchema, MuiInput),
  },
});
import { chatComposerEntries } from './registry/chat-composer.js';
import { colorPickerEntries } from './registry/color-picker.js';
import { fileUploadEntries } from './registry/file-upload.js';
