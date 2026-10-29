import { useState } from 'react';
import { MEDIA_DEFAULTS, MEDIA_DIMENSIONS } from '../../core/media-policy.js';

interface SafeImageProps {
  src: string;
  alt: string;
  presentation: keyof typeof MEDIA_DIMENSIONS;
}
const CLASSES = {
  editorial: 'reacd-safe-image reacd-editorial-image',
  logo: 'reacd-safe-image reacd-logo-image',
} as const;

function SourceImage({ src, alt, presentation }: SafeImageProps) {
  const [failed, setFailed] = useState<boolean>(MEDIA_DEFAULTS.failed);
  const dimensions = MEDIA_DIMENSIONS[presentation];
  const style = { aspectRatio: `${dimensions.width}/${dimensions.height}` };
  return failed ? (
    <div className={CLASSES[presentation]} style={style} role="img" aria-label={alt}>
      {MEDIA_DEFAULTS.unavailable} {alt}
    </div>
  ) : (
    <img
      className={CLASSES[presentation]}
      style={style}
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function SafeImage(props: SafeImageProps) {
  return <SourceImage key={props.src} {...props} />;
}
