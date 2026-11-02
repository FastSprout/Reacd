import { defineThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/validate-adapter.js';
import type { ThemeAdapter } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';
import { MuiSurface } from './surface/surface.adapter.js';
import { nativeFoundationEntries } from './registry/native-foundation.js';
import { nativeLayoutEntries } from './registry/native-layout.js';
import { nativeContentEntries } from './registry/native-content.js';
import { nativeStructureEntries } from './registry/native-structure.js';

import { nativeProseEntries } from './registry/native-prose.js';
import { nativeNavigationContentEntries } from
  './registry/native-navigation-content.js';
import { nativeFeedbackEntries } from './registry/native-feedback.js';
import { nativeLocaleEntries } from './registry/native-locale.js';


import { nativeRatingEntries } from './registry/native-rating.js';
import { nativeShowcaseEntries } from './registry/native-showcase.js';

export const muiAdapter: ThemeAdapter = defineThemeAdapter({
  id: 'material-ui',
  Surface: MuiSurface,
  components: {
    ...nativeProseEntries,
    ...nativeFoundationEntries,
    ...nativeLayoutEntries,
    ...nativeContentEntries,
    ...nativeStructureEntries,
    ...nativeNavigationContentEntries,
    ...nativeFeedbackEntries,
    ...nativeLocaleEntries,
    ...nativeRatingEntries,
    ...nativeShowcaseEntries,
  },
});
