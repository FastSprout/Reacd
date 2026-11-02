import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export interface PreviewEntry {
  layout: 'inline' | 'block';
  source: string;
  load: () => Promise<{ default: ComponentType }>;
  View: LazyExoticComponent<ComponentType>;
}

export function previewEntry(
  source: string,
  load: PreviewEntry['load'],
  layout: PreviewEntry['layout'] = 'block',
): PreviewEntry {
  return { source, load, layout, View: lazy(load) };
}
