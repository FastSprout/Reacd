import { createContext } from 'react';
import type { ThemeAdapter } from '../renderer/contracts/theme-adapter.js';
import type { TemplateRegistry } from '../schema/design/templates.schema.js';
import type { ReacdStore } from './store.js';

export interface ApplicationScope {
  adapter: ThemeAdapter;
  store: ReacdStore;
  templateId: string;
  templates: TemplateRegistry;
}

export const ApplicationContext = createContext<ApplicationScope | null>(null);
