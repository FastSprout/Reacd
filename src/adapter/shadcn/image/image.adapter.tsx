import { useCallback, useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import type { ImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/image/index.js';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { AspectRatio } from '../vendor/ui/aspect-ratio.js';
import { Card, CardContent } from '../vendor/ui/card.js';

export type ShadcnImageProps = ImageProps;

export function ShadcnImage({
  src,
  alt,
  aspect = COLOR_MODE_POLICY.defaultAspect,
}: ImageProps) {
  return <NativeImage key={src} src={src} alt={alt} aspect={aspect} />;
}

interface NativeImageProps {
  readonly src: string;
  readonly alt: string;
  readonly aspect: NonNullable<ImageProps['aspect']>;
}

function NativeImage({ src, alt, aspect }: NativeImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const reconcileImage = useCallback((image: HTMLImageElement | null) => {
    if (image !== null && image.complete) {
      setState(image.naturalWidth > 0 ? 'loaded' : 'failed');
    }
  }, []);
  const { width, height } = COLOR_MODE_POLICY.imageAspects[aspect];
  if (state === 'failed') {
    return (
      <Card aria-busy={false} className="min-w-0">
        <CardContent
          role="img"
          aria-label={alt}
          aria-description={COLOR_MODE_POLICY.imageFallback}
          className="min-w-0 p-2 text-center [overflow-wrap:anywhere]"
        >
          <ImageOffIcon aria-hidden="true" className="mx-auto mb-2" />
          {COLOR_MODE_POLICY.imageFallback}
        </CardContent>
      </Card>
    );
  }
  return (
    <AspectRatio
      ratio={width / height}
      aria-busy={state === 'loading'}
      className="overflow-hidden rounded-md"
    >
      <img
        ref={reconcileImage}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-contain"
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
      />
    </AspectRatio>
  );
}
