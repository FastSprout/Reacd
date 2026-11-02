import { createContext } from 'react';
import { PRICING_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';

export const PricingScaleContext = createContext<boolean>(PRICING_DEFAULTS.scale);
