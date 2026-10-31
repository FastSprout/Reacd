import { createContext } from 'react';
import type { AdapterPrimitives } from './contract.js';

export const PrimitiveContext = createContext<AdapterPrimitives | null>(null);

export const PRIMITIVE_SCOPE_ERROR = 'A concrete adapter primitive scope is required.';
