import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export interface PreviewEntry {
  source: string;
  load: () => Promise<{ default: ComponentType }>;
  View: LazyExoticComponent<ComponentType>;
}

export function previewEntry(source: string, load: PreviewEntry['load']): PreviewEntry {
  return { source, load, View: lazy(load) };
}
