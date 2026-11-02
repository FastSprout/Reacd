import { useContext } from 'react';
import type { PageHeroProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-hero/page-hero.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../vendor/ui/card.js';
import { Badge } from '../vendor/ui/badge.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { documentationLayoutVariables } from '../layout/layout-variables.js';

export type ShadcnPageHeroProps = PageHeroProps;
export function ShadcnPageHero({
  title,
  description,
  headline,
  children,
  links,
  header,
  footer,
  top,
  bottom,
  orientation = PAGE_PRESENTATION_DEFAULTS.orientation,
  reverse = PAGE_PRESENTATION_DEFAULTS.reverse,
}: PageHeroProps) {
  const level = useContext(HeadingLevelContext);
  return (
    <CardContent className="reacd-hero p-0" style={documentationLayoutVariables}>
      <CardContent className="reacd-hero-frame p-0">
        {top != null && <CardContent className="min-w-0 p-0">{top}</CardContent>}
        {header != null && <CardContent className="min-w-0 p-0">{header}</CardContent>}
        <CardContent
          className="reacd-hero-columns p-0"
          style={{
            gridTemplateColumns:
              orientation === 'horizontal'
                ? 'repeat(auto-fit, minmax(min(100%, var(--hero-track)), 1fr))'
                : 'minmax(0, 1fr)',
          }}
        >
          <CardHeader
            className="min-w-0 space-y-0 gap-4 p-0"
            style={{ order: reverse ? 1 : 0 }}
          >
            {headline && <Badge variant="secondary">{headline}</Badge>}
            {title && <ShadcnProseHeading level={level}>{title}</ShadcnProseHeading>}
            {description && <CardDescription>{description}</CardDescription>}
            {links != null && (
              <CardFooter className="min-w-0 flex-wrap gap-3 p-0">{links}</CardFooter>
            )}
          </CardHeader>
          <HeadingLevelContext.Provider value={title ? nextHeadingLevel(level) : level}>
            {children != null && (
              <CardContent className="min-w-0 p-0" style={{ order: reverse ? 0 : 1 }}>
                {children}
              </CardContent>
            )}
          </HeadingLevelContext.Provider>
        </CardContent>
        {footer != null && <CardContent className="min-w-0 p-0">{footer}</CardContent>}
        {bottom != null && <CardContent className="min-w-0 p-0">{bottom}</CardContent>}
      </CardContent>
    </CardContent>
  );
}
