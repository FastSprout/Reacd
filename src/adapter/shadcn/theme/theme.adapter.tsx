import { useContext, useMemo } from 'react';
import type { ThemeProps } from '../../../components/theme/theme.js';
import { RenderContext } from '../../../components/shared/port.js';
import type { RenderPort } from '../../../core/render-port.js';
import { ThemeVariablesContext } from '../../../renderer/theme/theme-context.js';
import { templateVariables } from '../../../renderer/theme/template-variables.js';
import { defaultProperties } from '../../../renderer/theme/default-properties.js';

export function ShadcnTheme({ children, template, defaults }: ThemeProps) {
  const inheritedVariables = useContext(ThemeVariablesContext);
  const inheritedPort = useContext(RenderContext);
  const variables =
    template === undefined ? inheritedVariables : templateVariables(template);
  const port = useMemo<RenderPort<Record<string, unknown>> | null>(() => {
    if (inheritedPort === null) return null;
    return {
      render(name, properties) {
        const fallback = Object.entries(defaults ?? {}).find(
          ([component]) => component === name,
        )?.[1];
        return inheritedPort.render(name, defaultProperties(properties, fallback));
      },
      report: (issues) => inheritedPort.report(issues),
    };
  }, [inheritedPort, defaults]);
  return (
    <ThemeVariablesContext.Provider value={variables}>
      <RenderContext.Provider value={port}>
        <div className="reacd-node reacd-theme" style={variables}>
          {children}
        </div>
      </RenderContext.Provider>
    </ThemeVariablesContext.Provider>
  );
}
