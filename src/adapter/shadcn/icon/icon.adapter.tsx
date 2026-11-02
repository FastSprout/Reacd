import {
  Check,
  CircleAlert,
  CircleCheck,
  Download,
  ExternalLink,
  Info,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  Settings,
  SunMoon,
  PanelLeft,
  TriangleAlert,
  Upload,
  X,
} from 'lucide-react';

const icons = {
  add: Plus,
  remove: Minus,
  close: X,
  check: Check,
  search: Search,
  info: Info,
  warning: TriangleAlert,
  error: CircleAlert,
  success: CircleCheck,
  settings: Settings,
  appearance: SunMoon,
  layout: PanelLeft,
  download: Download,
  upload: Upload,
  external: ExternalLink,
  loading: LoaderCircle,
};
import type { IconProps } from
  '@fastsprout/reacd/adapter-runtime/components/icon/icon.props.js';
import { ICON_POLICY } from '@fastsprout/reacd/adapter-runtime/core/icon-policy.js';
import { Spinner } from '../vendor/ui/spinner.js';

export type ShadcnIconProps = IconProps;
export function ShadcnIcon(properties: IconProps) {
  const Icon = properties.name === 'loading' ? Spinner : icons[properties.name];
  const dimension = `${ICON_POLICY.dimensionsRem[properties.size ?? 'medium']}rem`;
  return (
    <Icon
      role={properties.decorative ? undefined : 'img'}
      aria-label={properties.decorative ? undefined : properties.label}
      aria-hidden={properties.decorative}
      style={{ width: dimension, height: dimension }}
      className="shrink-0 motion-reduce:animate-none"
    />
  );
}
