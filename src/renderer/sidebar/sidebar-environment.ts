import { createContext } from 'react';
import type { RefObject } from 'react';

export const SidebarEnvironmentContext = createContext<{
  narrow: boolean;
  trigger: RefObject<HTMLButtonElement | null>;
} | null>(null);
