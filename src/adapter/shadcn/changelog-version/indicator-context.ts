import { createContext } from 'react';
import { EDITORIAL_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';

export const ChangelogIndicatorContext = createContext<boolean>(
  EDITORIAL_DEFAULTS.indicator,
);
