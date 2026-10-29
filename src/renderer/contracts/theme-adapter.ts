import type { ComponentType, ReactNode } from 'react';
import type { ComponentCatalog } from '../../components/catalog.js';
import type { DesignTemplate } from '../../schema/design/templates.schema.js';
import type { RenderEntry } from './render-entry.js';

export interface AdapterSurfaceProps {
  template: DesignTemplate;
  templateId: string;
  children?: ReactNode;
}

export type AdapterCatalog = {
  readonly [Name in keyof ComponentCatalog]: RenderEntry<Name>;
};

export interface ThemeAdapter {
  readonly id: string;
  readonly Surface: ComponentType<AdapterSurfaceProps>;
  readonly components: AdapterCatalog;
}
