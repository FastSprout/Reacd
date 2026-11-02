import type { ReactNode } from 'react';
import {
  Theme,
  darkTemplateVariants,
  templates,
  useColorMode,
  useDesignTemplate,
  useSystemColorMode,
} from '@fastsprout/reacd';

type AppearanceState = ReturnType<typeof useColorMode>;
export interface AppearancePreviewProps {
  readonly children: (appearance: AppearanceState) => ReactNode;
}

export function AppearancePreview({ children }: AppearancePreviewProps) {
  const system = useSystemColorMode('light');
  const appearance = useColorMode(system);
  const [profile] = useDesignTemplate();
  const key = profile === 'erp-compact' ? 'erp-compact' : 'saas-modern-light';
  const template =
    appearance.resolvedMode === 'dark' ? darkTemplateVariants[key] : templates[key];
  return <Theme template={template}>{children(appearance)}</Theme>;
}
