import { createContext } from 'react';
import type { RefObject } from 'react';
import type { PanelConstraint, PanelShare } from '../../core/splitter.js';
import type { useSplitterDrag } from '../splitter/use-splitter-drag.js';

export interface DashboardRegion extends PanelConstraint {
  readonly label: string;
  readonly kind: 'sidebar' | 'panel';
}

export interface DashboardContextValue {
  regions: readonly DashboardRegion[];
  value: readonly PanelShare[];
  onValueChange: (value: readonly PanelShare[]) => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (value: boolean) => void;
  narrow: boolean;
  disabled: boolean;
  collapseMode: 'offcanvas' | 'icon';
  prefix: string;
  resizeLabel: string | undefined;
  direction: 'ltr' | 'rtl';
  drag: ReturnType<typeof useSplitterDrag>;
  expanded: RefObject<Map<string, number>>;
  mobileTrigger: RefObject<HTMLButtonElement | null>;
  rememberTrigger: (element: HTMLButtonElement) => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);
export const DashboardRegionContext = createContext<{
  index: number;
  region: DashboardRegion;
  primary: boolean;
} | null>(null);
export const DashboardMainContext = createContext(false);
