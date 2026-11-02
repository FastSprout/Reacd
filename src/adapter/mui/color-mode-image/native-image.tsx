import { MEDIA_DIMENSIONS } from
  '@fastsprout/reacd/adapter-runtime/core/media-policy.js';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { COLOR_MODE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import type { ColorModeImageProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-image/index.js';

interface NativeImageProps {
  readonly source: string;
  readonly alt: string;
  readonly aspect: NonNullable<ColorModeImageProps['aspect']> | 'logo';
  readonly failureLabel?: string;
}

export function MuiNativeImage({
  source,
  alt,
  aspect,
  failureLabel,
}: NativeImageProps) {
  const [failed, setFailed] = useState(false);
  const dimensions = { ...COLOR_MODE_POLICY.imageAspects, logo: MEDIA_DIMENSIONS.logo }[
    aspect
  ];
  if (failed)
    return (
      <Paper role="img" aria-label={alt}>
        <Typography>{failureLabel ?? COLOR_MODE_POLICY.imageFallback}</Typography>
      </Paper>
    );
  return (
    <Box
      component="img"
      src={source}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      onError={() => setFailed(true)}
      sx={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        aspectRatio: dimensions.width / dimensions.height,
        objectFit: 'contain',
      }}
    />
  );
}
