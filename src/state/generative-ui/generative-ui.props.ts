import type { ThemeAdapter } from '../../renderer/contracts/theme-adapter.js';
import type { TemplateRegistry } from '../../schema/design/templates.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';

export interface GenerativeActionContext {
  state: StateRegistry;
}

export type GenerativeActions = Readonly<
  Record<string, (context: GenerativeActionContext) => void>
>;

export interface GenerativeUIProps {
  document: unknown;
  actions?: GenerativeActions;
  registry?: StateRegistry;
  adapter?: ThemeAdapter;
  templateId?: string;
  templates?: TemplateRegistry;
}
