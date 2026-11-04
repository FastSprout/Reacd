import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/image/index.js';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';

export type MuiImageProps = ImageProps;

export function MuiImage({
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
      <Box aria-busy={false} sx={{ width: '100%', maxWidth: '100%' }}>
        <Paper
          role="img"
          aria-label={alt}
          aria-description={COLOR_MODE_POLICY.imageFallback}
          sx={{ overflowWrap: 'anywhere' }}
        >
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {COLOR_MODE_POLICY.imageFallback}
          </Typography>
        </Paper>
      </Box>
    );
  }
  return (
    <Box
      aria-busy={state === 'loading'}
      sx={{ aspectRatio: width / height, width: '100%', maxWidth: '100%' }}
    >
      <Box
        component="img"
        ref={reconcileImage}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
