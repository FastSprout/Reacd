import { useContext, useId } from 'react';
import type { ReactNode } from 'react';
import { HeadingLevelContext } from '../heading/heading-context.js';
import { nextHeadingLevel } from '../../core/heading-policy.js';
import { PAGE_PRESENTATION_DEFAULTS } from '../../core/page-presentation-policy.js';
import { PageHeading } from './page-heading.js';

export interface PageIntroductionProps {
  kind: 'header' | 'feature' | 'card' | 'hero' | 'section' | 'cta';
  anchor?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  headline?: string | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  newWindow?: boolean | undefined;
  orientation?: 'vertical' | 'horizontal' | undefined;
  reverse?: boolean | undefined;
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'naked' | undefined;
  intent?: 'neutral' | 'primary' | 'danger' | undefined;
  highlight?: boolean | undefined;
  spotlight?: boolean | undefined;
  children?: ReactNode;
  leading?: ReactNode;
  links?: ReactNode;
  features?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
}

const ROOTS = {
  cta: 'section',
  header: 'header',
  feature: 'div',
  card: 'article',
  hero: 'section',
  section: 'section',
} as const;

export function PageIntroduction({
  kind,
  anchor,
  title,
  description,
  headline,
  children,
  leading,
  links,
  features,
  header,
  footer,
  top,
  bottom,
  href,
  onPress,
  newWindow,
  orientation = PAGE_PRESENTATION_DEFAULTS.orientation,
  reverse = PAGE_PRESENTATION_DEFAULTS.reverse,
  variant = PAGE_PRESENTATION_DEFAULTS.variant,
  intent = PAGE_PRESENTATION_DEFAULTS.intent,
  highlight = PAGE_PRESENTATION_DEFAULTS.highlight,
  spotlight = PAGE_PRESENTATION_DEFAULTS.spotlight,
}: PageIntroductionProps): ReactNode {
  const level = useContext(HeadingLevelContext);
  const generatedId = useId();
  const id = anchor ?? generatedId;
  const Root = ROOTS[kind];
  const descendantLevel = title === undefined ? level : nextHeadingLevel(level);
  const introduction = (
    <div className="reacd-page-intro-copy" key="introduction">
      <HeadingLevelContext.Provider value={descendantLevel}>
        {leading}
      </HeadingLevelContext.Provider>
      {headline !== undefined && <p className="reacd-page-headline">{headline}</p>}
      <PageHeading
        id={id}
        anchor={anchor}
        title={title}
        href={href}
        onPress={onPress}
        newWindow={newWindow}
      />
      {description !== undefined && (
        <p className="reacd-page-description">{description}</p>
      )}
      <HeadingLevelContext.Provider value={descendantLevel}>
        {links}
        {features}
      </HeadingLevelContext.Provider>
    </div>
  );
  const content =
    children === undefined ? null : (
      <div className="reacd-page-intro-content" key="content">
        <HeadingLevelContext.Provider value={descendantLevel}>
          {children}
        </HeadingLevelContext.Provider>
      </div>
    );
  return (
    <Root
      className="reacd-node reacd-page-introduction"
      data-kind={kind}
      data-orientation={orientation}
      data-variant={variant}
      data-intent={intent}
      data-highlight={highlight}
      data-spotlight={spotlight}
      aria-labelledby={title === undefined ? undefined : id}
    >
      <HeadingLevelContext.Provider value={descendantLevel}>
        {top}
        {header}
      </HeadingLevelContext.Provider>
      <div className="reacd-page-intro-regions">
        {reverse ? [content, introduction] : [introduction, content]}
      </div>
      <HeadingLevelContext.Provider value={descendantLevel}>
        {footer}
        {bottom}
      </HeadingLevelContext.Provider>
    </Root>
  );
}
