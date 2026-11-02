import { defineThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/validate-adapter.js';
import type { ThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';
import { ShadcnSurface } from './surface/surface.adapter.js';
import { nativeFoundationEntries } from './registry/native-foundation.js';
import { nativeLayoutEntries } from './registry/native-layout.js';
import { nativeContentEntries } from './registry/native-content.js';
import { nativeStructureEntries } from './registry/native-structure.js';
import { nativeSearchEntries } from './registry/native-search.js';

import { nativeProseEntries } from './registry/native-prose.js';

import { nativeDocumentationEntries } from './registry/native-documentation.js';
import { nativeDocumentationContentEntries } from
  './registry/native-documentation-content.js';
import { nativePagesEntries } from './registry/native-pages.js';
import { nativeExtraControlsEntries } from './registry/native-extra-controls.js';
import { nativeNavigationContentEntries } from
  './registry/native-navigation-content.js';
import { nativeFeedbackEntries } from './registry/native-feedback.js';
import { nativePublicationEntries } from './registry/native-publication.js';
import { nativeAuthenticationEntries } from './registry/native-authentication.js';
import { nativeLocaleEntries } from './registry/native-locale.js';
import { nativeOverlayEntries } from './registry/native-overlays.js';
import { nativeChatEntries } from './registry/native-chat.js';
import { nativeActionMenuEntries } from './registry/native-action-menus.js';

import { nativeContextMenuEntries } from './registry/native-context-menu.js';
import { nativeDashboardEntries } from './registry/native-dashboard.js';

import { nativeRatingEntries } from './registry/native-rating.js';
import { nativeStepperEntries } from './registry/native-stepper.js';
import { nativeCalendarEntries } from './registry/native-calendar.js';
import { nativeSelectionEntries } from './registry/native-selection.js';
import { nativeTemporalEntries } from './registry/native-temporal.js';
import { nativeChartEntries } from './registry/native-chart.js';
import { nativeInputMenuEntries } from './registry/native-input-menu.js';
import { nativeInputTagsEntries } from './registry/native-input-tags.js';
import { nativeToastEntries } from './registry/native-toast.js';

export const shadcnAdapter: ThemeAdapter = defineThemeAdapter({
  id: 'shadcn-ui',
  Surface: ShadcnSurface,
  components: {
    ...nativeProseEntries,
    ...nativeFoundationEntries,
    ...nativeLayoutEntries,
    ...nativeContentEntries,
    ...nativeStructureEntries,
    ...nativeDocumentationEntries,
    ...nativeDocumentationContentEntries,
    ...nativePagesEntries,
    ...nativeExtraControlsEntries,
    ...nativeNavigationContentEntries,
    ...nativeFeedbackEntries,
    ...nativePublicationEntries,
    ...nativeAuthenticationEntries,
    ...nativeLocaleEntries,
    ...nativeRatingEntries,
    ...nativeStepperEntries,
    ...nativeCalendarEntries,
    ...nativeSelectionEntries,
    ...nativeTemporalEntries,
    ...nativeChartEntries,
    ...nativeInputMenuEntries,
    ...nativeInputTagsEntries,
    ...nativeToastEntries,
    ...nativeDashboardEntries,
    ...nativeOverlayEntries,
    ...nativeChatEntries,
    ...nativeActionMenuEntries,
    ...nativeContextMenuEntries,
    ...nativeSearchEntries,
  },
});
