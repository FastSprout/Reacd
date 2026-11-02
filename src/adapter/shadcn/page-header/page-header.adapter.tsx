import { useContext, useId } from 'react';
import type { PageHeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-header/page-header.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_FRAME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-navigation-policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../vendor/ui/card.js';
import { Badge } from '../vendor/ui/badge.js';

export type ShadcnPageHeaderProps = PageHeaderProps;
export function ShadcnPageHeader({
  title,
  headline,
  description,
  anchor,
  children,
  links,
}: PageHeaderProps) {
  const level = useContext(HeadingLevelContext);
  const id = useId();
  return (
    <CardHeader
      id={anchor}
      className="min-w-0 p-0"
      tabIndex={anchor === undefined ? undefined : PAGE_FRAME_POLICY.anchorTabIndex}
    >
      {headline && <Badge variant="secondary">{headline}</Badge>}
      {title && (
        <CardTitle
          role="heading"
          aria-level={level}
          id={id}
          style={{ fontSize: `${PAGE_PRESENTATION_POLICY.titleScale.header}em` }}
        >
          {title}
        </CardTitle>
      )}
      {description && <CardDescription>{description}</CardDescription>}
      <HeadingLevelContext.Provider value={title ? nextHeadingLevel(level) : level}>
        {children != null && <CardContent className="p-0">{children}</CardContent>}
        {links != null && (
          <CardFooter className="flex-wrap gap-2 p-0">{links}</CardFooter>
        )}
      </HeadingLevelContext.Provider>
    </CardHeader>
  );
}
