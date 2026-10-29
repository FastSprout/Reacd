import { createContext } from 'react';
import { HEADING_POLICY } from '../../core/heading-policy.js';
import type { HeadingLevel } from '../../core/heading-policy.js';

export const HeadingLevelContext = createContext<HeadingLevel>(HEADING_POLICY.root);
