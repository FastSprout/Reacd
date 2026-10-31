import { useContext, useId } from 'react';
import type { PageLogosProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-logos/page-logos.props.js';
import { MEDIA_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/media-policy.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { PageHeading } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-heading.js';
import { SafeImage } from
  '@fastsprout/reacd/adapter-runtime/renderer/media/safe-image.js';

export function ShadcnPageLogos({
  label,
  title,
  items,
  emptyLabel = MEDIA_DEFAULTS.emptyLogos,
}: PageLogosProps) {
  const level = useContext(HeadingLevelContext);
  const id = useId();
  return (
    <section className="reacd-node reacd-page-logos" aria-label={label}>
      <HeadingLevelContext.Provider value={level}>
        <PageHeading title={title} id={id} />
      </HeadingLevelContext.Provider>
      {items.length === 0 ? (
        <p>{emptyLabel}</p>
      ) : (
        <ul className="reacd-logo-list">
          {items.map((item) => (
            <li key={item.key}>
              <SafeImage src={item.src} alt={item.alt} presentation="logo" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
