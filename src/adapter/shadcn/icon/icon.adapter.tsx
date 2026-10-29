import type { IconProps } from '../../../components/icon/index.js';
import { ICON_POLICY } from '../../../core/icon-policy.js';
import { SEMANTIC_ICONS } from './icon-map.js';
export function ShadcnIcon({
  name,
  label,
  decorative,
  size = ICON_POLICY.defaultSize,
}: IconProps) {
  const Glyph = SEMANTIC_ICONS[name];
  return (
    <Glyph
      className="reacd-icon"
      data-size={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    />
  );
}
