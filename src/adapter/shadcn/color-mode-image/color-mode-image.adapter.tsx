import type { ColorModeImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-image/index.js';
import { ModeImage } from './mode-image.js';

export function ShadcnColorModeImage({
  mode,
  light,
  dark,
  ...properties
}: ColorModeImageProps) {
  const source = mode === 'light' ? light : dark;
  return <ModeImage key={source} {...properties} src={source} />;
}
