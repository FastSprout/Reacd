import { useContext } from 'react';
import type { PageCTAProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-cta/page-cta.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_PRESENTATION_DEFAULTS as DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from '../vendor/ui/card.js';
import { Badge } from '../vendor/ui/badge.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import { usePageSurface } from '../page-card/surface.js';

export type ShadcnPageCTAProps = PageCTAProps;
export function ShadcnPageCTA({
  title,
  description,
  headline,
  children,
  links,
  top,
  bottom,
  header,
  footer,
  variant = DEFAULTS.variant,
  reverse = DEFAULTS.reverse,
  orientation = DEFAULTS.orientation,
}: PageCTAProps) {
  const level = useContext(HeadingLevelContext);
  const surface = usePageSurface(variant, DEFAULTS.intent);
  const introduction = (
    <CardHeader key="introduction" className="min-w-0">
      {headline && <Badge variant="secondary">{headline}</Badge>}
      {title && <ShadcnProseHeading level={level}>{title}</ShadcnProseHeading>}
      {description && <CardDescription>{description}</CardDescription>}
      {links !== undefined && (
        <CardFooter className="flex-wrap p-0">{links}</CardFooter>
      )}
    </CardHeader>
  );
  const content = (
    <HeadingLevelContext key="content" value={title ? nextHeadingLevel(level) : level}>
      <CardContent className="min-w-0">{children}</CardContent>
    </HeadingLevelContext>
  );
  return (
    <ShadcnThemeContext value={surface.variables}>
      <Card className={surface.className} style={surface.style}>
        {top !== undefined && <CardContent>{top}</CardContent>}
        {header !== undefined && <CardHeader>{header}</CardHeader>}
        <CardContent
          className="flex min-w-0 flex-wrap p-0"
          style={{
            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
            gap: 'var(--space-medium)',
          }}
        >
          {reverse ? [content, introduction] : [introduction, content]}
        </CardContent>
        {footer !== undefined && <CardFooter>{footer}</CardFooter>}
        {bottom !== undefined && <CardContent>{bottom}</CardContent>}
      </Card>
    </ShadcnThemeContext>
  );
}
