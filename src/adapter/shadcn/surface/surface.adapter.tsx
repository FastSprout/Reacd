import type { AdapterSurfaceProps } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';

import { ShadcnThemeContext } from './theme-context.js';
import { shadcnThemeVariables } from './theme-variables.js';
import { NativeToastSurface } from '../toast/provider.js';

export function ShadcnSurface({ children, template, templateId }: AdapterSurfaceProps) {
  const variables = shadcnThemeVariables(template);
  return (
    <ShadcnThemeContext.Provider value={variables}>
      <div
        className="font-sans text-base text-foreground bg-background"
        style={variables}
        data-template={templateId}
        data-adapter="shadcn-ui"
      >
        <NativeToastSurface>{children}</NativeToastSurface>
      </div>
    </ShadcnThemeContext.Provider>
  );
}
