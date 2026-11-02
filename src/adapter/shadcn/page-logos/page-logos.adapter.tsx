import { useContext, useState } from 'react';
import { ImageOffIcon } from 'lucide-react';
import type { PageLogosProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-logos/page-logos.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import {
  MEDIA_DEFAULTS,
  MEDIA_DIMENSIONS,
} from '@fastsprout/reacd/adapter-runtime/core/media-policy.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import { AspectRatio } from '../vendor/ui/aspect-ratio.js';
import { ShadcnProseHeading } from '../prose/typography.js';

export type ShadcnPageLogosProps = PageLogosProps;
function Logo({ src, alt }: Pick<PageLogosProps['items'][number], 'src' | 'alt'>) {
  const [failed, setFailed] = useState(false);
  const { width, height } = MEDIA_DIMENSIONS.logo;
  if (failed)
    return (
      <CardContent
        role="img"
        aria-label={alt}
        className="flex min-w-0 flex-wrap items-center justify-center p-0"
        style={{ minBlockSize: height, overflowWrap: 'anywhere' }}
      >
        <ImageOffIcon aria-hidden />
        {MEDIA_DEFAULTS.unavailable} {alt}
      </CardContent>
    );
  return (
    <AspectRatio ratio={width / height}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </AspectRatio>
  );
}
export function ShadcnPageLogos({
  label,
  title,
  items,
  emptyLabel = MEDIA_DEFAULTS.emptyLogos,
}: PageLogosProps) {
  const level = useContext(HeadingLevelContext);
  const track = `min(100%, ${MEDIA_DIMENSIONS.logo.width}px)`;
  const columns = `repeat(auto-fit, minmax(${track}, 1fr))`;
  return (
    <CardContent
      className="grid min-w-0 p-0"
      style={{ gap: 'var(--space-medium)', overflowWrap: 'anywhere' }}
    >
      {title && <ShadcnProseHeading level={level}>{title}</ShadcnProseHeading>}
      {items.length === 0 ? (
        <CardDescription>{emptyLabel}</CardDescription>
      ) : (
        <CardContent
          role="list"
          aria-label={label}
          className="grid min-w-0 p-0"
          style={{ gridTemplateColumns: columns, gap: 'var(--space-medium)' }}
        >
          {items.map((item) => (
            <CardContent role="listitem" key={item.key} className="min-w-0 p-0">
              <Logo key={item.src} src={item.src} alt={item.alt} />
            </CardContent>
          ))}
        </CardContent>
      )}
    </CardContent>
  );
}
