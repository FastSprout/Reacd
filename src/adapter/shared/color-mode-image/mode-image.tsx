import { useState } from 'react';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import type { ColorModeImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-image/index.js';

export function ModeImage({
  src,
  alt,
  aspect = COLOR_MODE_POLICY.defaultAspect,
}: Pick<ColorModeImageProps, 'alt' | 'aspect'> & { src: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const dimensions = COLOR_MODE_POLICY.imageAspects[aspect];
  return (
    <div
      className="reacd-node reacd-color-mode-image"
      role="img"
      aria-label={alt}
      aria-busy={status === 'loading' || undefined}
      data-status={status}
      style={{ aspectRatio: dimensions.width / dimensions.height }}
    >
      {status === 'error' ? (
        <span>
          {COLOR_MODE_POLICY.imageFallback}: {alt}
        </span>
      ) : (
        <>
          <img
            src={src}
            alt=""
            width={dimensions.width}
            height={dimensions.height}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
          {status === 'loading' && <span aria-hidden="true">{alt}</span>}
        </>
      )}
    </div>
  );
}
