import { createContext } from 'react';
import { EDITORIAL_DEFAULTS } from '../../core/editorial-policy.js';

export const EditorialIndicatorContext = createContext<boolean>(
  EDITORIAL_DEFAULTS.indicator,
);
