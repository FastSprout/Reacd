import type { ThemeAdapter } from '../../renderer/contracts/theme-adapter.js';
import type { TemplateRegistry } from '../../schema/design/templates.schema.js';
import type { ReacdStore } from '../store.js';

export type ActionContext = { values: Readonly<Record<string, string>> };
export type ActionHandlers = Readonly<Record<string, (context: ActionContext) => void>>;

export interface RendererProps {
  document: unknown;
  actions: ActionHandlers;
  templateId?: string | undefined;
  templates?: TemplateRegistry | undefined;
  adapter?: ThemeAdapter | undefined;
  store?: ReacdStore | undefined;
}
