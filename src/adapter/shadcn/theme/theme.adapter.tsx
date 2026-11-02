import type { ThemeProps } from
  '@fastsprout/reacd/adapter-runtime/components/theme/theme.props.js';
import { DeclarationDefaults } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/declaration-defaults.js';
import { ShadcnSurface } from '../surface/surface.adapter.js';

export type ShadcnThemeProps = ThemeProps;
export function ShadcnTheme({ template, defaults, children }: ThemeProps) {
  return (
    <DeclarationDefaults defaults={defaults}>
      {template ? (
        <ShadcnSurface template={template} templateId={template.name}>
          {children}
        </ShadcnSurface>
      ) : (
        children
      )}
    </DeclarationDefaults>
  );
}
