import { createContext } from 'react';
import type { RegistrationScope } from './registration-scope.js';

export const RegistrationContext = createContext<RegistrationScope | null>(null);
