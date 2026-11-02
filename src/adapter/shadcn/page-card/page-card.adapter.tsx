import { useContext } from 'react';
import type { PageCardProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-card/page-card.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_PRESENTATION_DEFAULTS as DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { Card, CardContent, CardFooter, CardHeader } from '../vendor/ui/card.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import { ShadcnPageFeature } from '../page-feature/page-feature.adapter.js';
import { usePageSurface } from './surface.js';

export type ShadcnPageCardProps = PageCardProps;
export function ShadcnPageCard(props: PageCardProps) {
  const level = useContext(HeadingLevelContext);
  const descendants = props.title === undefined ? level : nextHeadingLevel(level);
  const spotlight = props.spotlight ?? DEFAULTS.spotlight;
  const variant = props.variant ?? DEFAULTS.variant;
  const surface = usePageSurface(
    variant,
    props.intent ?? DEFAULTS.intent,
    props.highlight ?? DEFAULTS.highlight,
    spotlight,
  );
  const introduction = (
    <ShadcnPageFeature
      key="introduction"
      title={props.title}
      description={props.description}
      leading={props.leading}
      href={props.href}
      onPress={props.onPress}
      newWindow={props.newWindow}
      orientation="vertical"
    />
  );
  const content = (
    <HeadingLevelContext key="content" value={descendants}>
      <CardContent className="min-w-0 max-w-full p-0">{props.children}</CardContent>
    </HeadingLevelContext>
  );
  const reverse = props.reverse ?? DEFAULTS.reverse;
  const horizontal = props.orientation === 'horizontal';
  return (
    <ShadcnThemeContext value={surface.variables}>
      <Card
        role="article"
        aria-label={props.title}
        className={`min-w-0 ${surface.className}`}
        style={surface.style}
        tabIndex={spotlight ? 0 : undefined}
      >
        <HeadingLevelContext value={descendants}>
          {props.header !== undefined && <CardHeader>{props.header}</CardHeader>}
        </HeadingLevelContext>
        <CardContent
          className="flex min-w-0 flex-wrap"
          style={{
            padding: variant === 'naked' ? 0 : undefined,
            flexDirection: horizontal ? 'row' : 'column',
            gap: 'var(--space-medium)',
          }}
        >
          {reverse ? [content, introduction] : [introduction, content]}
        </CardContent>
        <HeadingLevelContext value={descendants}>
          {props.footer !== undefined && <CardFooter>{props.footer}</CardFooter>}
        </HeadingLevelContext>
      </Card>
    </ShadcnThemeContext>
  );
}
