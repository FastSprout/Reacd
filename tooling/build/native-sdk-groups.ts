const MATERIAL_PRIORITY = 0;
const SDK_PRIORITY = 1;
const LOCALE_PRIORITY = 2;
const ENGLISH_PRIORITY = 3;

export const nativeSdkChunkGroups = [
  {
    name: 'shadcn', priority: SDK_PRIORITY,
    test: /[\\/]adapter[\\/]shadcn[\\/]/,
    includeDependenciesRecursively: false,
  },
  {
    name: 'mui', priority: SDK_PRIORITY,
    test: /[\\/]adapter[\\/]mui[\\/]/,
    includeDependenciesRecursively: false,
  },
  {
    name: 'material-ui', priority: MATERIAL_PRIORITY,
    test: /node_modules[\\/](@mui|@emotion)[\\/]/,
  },
  {
    name: 'material-charts', priority: SDK_PRIORITY,
    test: /node_modules[\\/]@mui[\\/]x-(charts|internal-gestures|internals)/,
  },
  {
    name: 'material-dates', priority: SDK_PRIORITY,
    test: /node_modules[\\/]@mui[\\/]x-date-pickers[\\/]/,
  },
  {
    name: 'date-locales-english', priority: ENGLISH_PRIORITY,
    test: /node_modules[\\/]date-fns[\\/]locale[\\/]en/,
  },
  {
    name: 'date-locales-a-m', priority: LOCALE_PRIORITY,
    test: /node_modules[\\/]date-fns[\\/]locale[\\/][a-m]/,
  },
  {
    name: 'date-locales-n-z', priority: LOCALE_PRIORITY,
    test: /node_modules[\\/]date-fns[\\/]locale[\\/][n-z]/,
  },
];
