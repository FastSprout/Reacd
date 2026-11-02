import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';

export const ShadcnThemeContext = createContext<CSSProperties | undefined>(undefined);
export function useShadcnTheme() {
  return useContext(ShadcnThemeContext);
}
