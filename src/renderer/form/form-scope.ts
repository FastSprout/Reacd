import { createContext } from 'react';
import { FORM_DEFAULTS } from '../../core/form-policy.js';

export const FormScopeContext = createContext<boolean>(FORM_DEFAULTS.insideForm);
