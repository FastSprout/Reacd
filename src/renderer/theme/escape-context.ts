import { createContext } from 'react';
import type { EscapeScope } from './escape-scope.js';
export const EscapeScopeContext = createContext<EscapeScope | null>(null);
