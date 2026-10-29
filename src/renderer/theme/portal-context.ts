import { createContext } from 'react';

export const PortalHostContext = createContext<HTMLElement | null>(null);
export const PortalActiveContext = createContext(true);
