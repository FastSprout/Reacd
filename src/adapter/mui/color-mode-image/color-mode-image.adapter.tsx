import type { ColorModeImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-image/index.js';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { MuiNativeImage } from './native-image.js';

export type MuiColorModeImageProps = ColorModeImageProps;

export function MuiColorModeImage(props: MuiColorModeImageProps) {
  const source = props.mode === 'dark' ? props.dark : props.light;
  return (
    <MuiNativeImage
      key={source}
      source={source}
      alt={props.alt}
      aspect={props.aspect ?? COLOR_MODE_POLICY.defaultAspect}
    />
  );
}
