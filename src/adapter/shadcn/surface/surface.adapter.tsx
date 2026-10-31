import type { AdapterSurfaceProps } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/theme-adapter.js';
import { ShadcnToastProvider } from '../toast/toast-provider.js';
import { templateVariables } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/template-variables.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { PrimitiveScope } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export function ShadcnSurface({ children, template, templateId }: AdapterSurfaceProps) {
  const variables = templateVariables(template);
  return (
    <PrimitiveScope primitives={shadcnPrimitives}>
      <ThemeVariablesContext.Provider value={variables}>
        <div
          className="reacd-root"
          data-template={templateId}
          data-adapter="shadcn-ui"
          style={variables}
        >
          <ShadcnToastProvider>{children}</ShadcnToastProvider>
        </div>
      </ThemeVariablesContext.Provider>
    </PrimitiveScope>
  );
}
