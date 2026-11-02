import { useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import type { BlogPostProps } from
  '@fastsprout/reacd/adapter-runtime/components/blog-post/blog-post.props.js';
import {
  EDITORIAL_DEFAULTS,
  EDITORIAL_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';
import { AspectRatio } from '../vendor/ui/aspect-ratio.js';
import { CardContent } from '../vendor/ui/card.js';

export function ShadcnEditorialImage({
  src,
  alt,
}: NonNullable<BlogPostProps['image']>) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <CardContent
        role="img"
        aria-label={alt}
        className="flex min-w-0 flex-wrap items-center justify-center"
        style={{ minBlockSize: EDITORIAL_POLICY.imageHeight, overflowWrap: 'anywhere' }}
      >
        <ImageOffIcon aria-hidden />
        {EDITORIAL_DEFAULTS.unavailableImage} {alt}
      </CardContent>
    );
  return (
    <AspectRatio ratio={EDITORIAL_POLICY.imageWidth / EDITORIAL_POLICY.imageHeight}>
      <img
        src={src}
        alt={alt}
        width={EDITORIAL_POLICY.imageWidth}
        height={EDITORIAL_POLICY.imageHeight}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </AspectRatio>
  );
}
