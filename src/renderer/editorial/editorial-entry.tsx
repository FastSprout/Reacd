import { useContext, useId } from 'react';
import type { ReactNode } from 'react';
import type { BlogPostProps } from '../../components/blog-post/blog-post.props.js';
import { EDITORIAL_DEFAULTS } from '../../core/editorial-policy.js';
import { HeadingLevelContext } from '../heading/heading-context.js';
import { nextHeadingLevel } from '../../core/heading-policy.js';
import { PageHeading } from '../page-introduction/page-heading.js';
import { EditorialImage } from './editorial-image.js';
import { EditorialIndicatorContext } from './indicator-context.js';

export function EditorialEntrySurface({
  kind,
  title,
  description,
  date,
  dateLabel,
  image,
  header,
  badge,
  authors,
  footer,
  actions,
  children,
  href,
  onPress,
  newWindow,
  orientation = EDITORIAL_DEFAULTS.orientation,
  variant = EDITORIAL_DEFAULTS.variant,
  indicator,
}: BlogPostProps & {
  kind: 'blog' | 'changelog';
  indicator?: boolean | undefined;
}): ReactNode {
  const id = useId();
  const level = useContext(HeadingLevelContext);
  const inheritedIndicator = useContext(EditorialIndicatorContext);
  const descendantLevel = title === undefined ? level : nextHeadingLevel(level);
  return (
    <article
      className="reacd-node reacd-editorial"
      data-kind={kind}
      data-orientation={orientation}
      data-variant={variant}
      data-indicator={kind === 'changelog' && (indicator ?? inheritedIndicator)}
      aria-labelledby={title === undefined ? undefined : id}
    >
      {(image !== undefined || header !== undefined) && (
        <div className="reacd-editorial-media">
          {image !== undefined && <EditorialImage key={image.src} {...image} />}
          <HeadingLevelContext.Provider value={descendantLevel}>
            {header}
          </HeadingLevelContext.Provider>
        </div>
      )}
      <div className="reacd-editorial-copy">
        <HeadingLevelContext.Provider value={descendantLevel}>
          <div className="reacd-editorial-meta">
            {date !== undefined && <time dateTime={date}>{dateLabel ?? date}</time>}
            {badge}
          </div>
        </HeadingLevelContext.Provider>
        <PageHeading
          id={id}
          title={title}
          href={href}
          onPress={onPress}
          newWindow={newWindow}
        />
        {description !== undefined && <p>{description}</p>}
        <HeadingLevelContext.Provider value={descendantLevel}>
          {children}
          {authors}
          {footer}
          {actions}
        </HeadingLevelContext.Provider>
      </div>
    </article>
  );
}
