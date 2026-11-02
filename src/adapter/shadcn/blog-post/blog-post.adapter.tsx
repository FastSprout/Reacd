import { Children } from 'react';
import type { BlogPostProps } from
  '@fastsprout/reacd/adapter-runtime/components/blog-post/blog-post.props.js';
import { EDITORIAL_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';
import { CardDescription } from '../vendor/ui/card.js';
import { ShadcnPageCard } from '../page-card/page-card.adapter.js';
import { ShadcnEditorialImage } from './editorial-image.js';

export type ShadcnBlogPostProps = BlogPostProps;
export function ShadcnBlogPost({
  title,
  description,
  href,
  onPress,
  newWindow,
  image,
  date,
  dateLabel,
  header,
  badge,
  authors,
  children,
  footer,
  actions,
  orientation = EDITORIAL_DEFAULTS.orientation,
  variant = EDITORIAL_DEFAULTS.variant,
}: BlogPostProps) {
  const hasMetadata =
    Children.toArray([header, badge, authors]).length > 0 || date !== undefined;
  const hasFooter = Children.toArray([footer, actions]).length > 0;
  return (
    <ShadcnPageCard
      title={title}
      description={description}
      href={href}
      onPress={onPress}
      newWindow={newWindow}
      orientation={orientation}
      variant={variant}
      header={
        hasMetadata ? (
          <>
            {header}
            {badge}
            {date && (
              <CardDescription>
                <time dateTime={date}>{dateLabel ?? date}</time>
              </CardDescription>
            )}
            {authors}
          </>
        ) : undefined
      }
      footer={
        hasFooter ? (
          <>
            {footer}
            {actions}
          </>
        ) : undefined
      }
    >
      {image && (
        <ShadcnEditorialImage key={image.src} src={image.src} alt={image.alt} />
      )}
      {children}
    </ShadcnPageCard>
  );
}
