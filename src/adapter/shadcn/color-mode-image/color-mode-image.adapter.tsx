import { useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import type { ColorModeImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-image/index.js';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { AspectRatio } from '../vendor/ui/aspect-ratio.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnColorModeImageProps = ColorModeImageProps;
export function ShadcnColorModeImage({
  mode,
  light,
  dark,
  alt,
  aspect = COLOR_MODE_POLICY.defaultAspect,
}: ColorModeImageProps) {
  const src = mode === 'dark' ? dark : light;
  return <NativeImage key={src} src={src} alt={alt} aspect={aspect} />;
}
interface ImageProperties {
  readonly src: string;
  readonly alt: string;
  readonly aspect: NonNullable<ColorModeImageProps['aspect']>;
}
function NativeImage({ src, alt, aspect }: ImageProperties) {
  const [failed, setFailed] = useState(false);
  const { width, height } = COLOR_MODE_POLICY.imageAspects[aspect];
  return (
    <AspectRatio ratio={width / height} className="overflow-hidden rounded-md">
      {failed ? (
        <CardContent
          role="img"
          aria-label={alt}
          className="flex h-full items-center justify-center gap-2 bg-muted"
        >
          <ImageOffIcon aria-hidden="true" />
          {COLOR_MODE_POLICY.imageFallback}
        </CardContent>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </AspectRatio>
  );
}
