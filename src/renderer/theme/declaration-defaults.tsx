import { useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { RenderContext } from '../../components/shared/port.js';
import type { ThemeProps } from '../../components/theme/theme.props.js';
import type { RenderPort } from '../../core/render-port.js';
import { isRecord } from '../../core/value.js';
import { defaultProperties } from './default-properties.js';

export interface DeclarationDefaultsProps {
  readonly defaults?: ThemeProps['defaults'];
  readonly children?: ReactNode;
}

export function DeclarationDefaults({ defaults, children }: DeclarationDefaultsProps) {
  const inherited = useContext(RenderContext);
  const port = useMemo<RenderPort<Record<string, unknown>> | null>(() => {
    if (inherited === null) return null;
    const configured: Readonly<Record<string, unknown>> = defaults ?? {};
    return {
      render(name, properties) {
        const candidate = Object.hasOwn(configured, name)
          ? configured[name]
          : undefined;
        return inherited.render(
          name,
          defaultProperties(properties, isRecord(candidate) ? candidate : undefined),
        );
      },
      report(issues) {
        return inherited.report(issues);
      },
    };
  }, [inherited, defaults]);
  return <RenderContext.Provider value={port}>{children}</RenderContext.Provider>;
}
