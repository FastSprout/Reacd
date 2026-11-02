import { useContext } from 'react';
import type { PageSectionProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-section/index.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import {
  nextHeadingLevel,
  sectionHeadingLevel,
} from '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
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

export type ShadcnPageSectionProps = PageSectionProps;
export function ShadcnPageSection({
  title,
  description,
  headline,
  children,
  links,
  header,
  footer,
  top,
  bottom,
  anchor,
  leading,
  features,
  orientation = PAGE_PRESENTATION_DEFAULTS.orientation,
  reverse = PAGE_PRESENTATION_DEFAULTS.reverse,
}: PageSectionProps) {
  const parentLevel = useContext(HeadingLevelContext);
  const level = sectionHeadingLevel(parentLevel);
  return (
    <CardContent
      className="reacd-page-section p-0"
      style={documentationLayoutVariables}
    >
      <CardContent className="reacd-page-section-frame p-0">
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
            {leading != null && (
              <CardContent className="min-w-0 p-0">{leading}</CardContent>
            )}
            {headline && <Badge variant="secondary">{headline}</Badge>}
            {title && (
              <ShadcnProseHeading level={level} id={anchor}>
                {title}
              </ShadcnProseHeading>
            )}
            {description && <CardDescription>{description}</CardDescription>}
            {features != null && (
              <CardContent className="min-w-0 p-0">{features}</CardContent>
            )}
            {links != null && (
              <CardFooter className="min-w-0 flex-wrap gap-3 p-0">{links}</CardFooter>
            )}
          </CardHeader>
          <HeadingLevelContext.Provider
            value={title ? nextHeadingLevel(level) : parentLevel}
          >
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
