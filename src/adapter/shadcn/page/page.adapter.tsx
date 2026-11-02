import { ShellLayoutContext } from '../layout/shell-layout-context.js';
import { Children, useContext, useId } from 'react';
import type { PageProps } from
  '@fastsprout/reacd/adapter-runtime/components/page/page.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { MainScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/main/main-scope.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { DOCUMENTATION_LAYOUT_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';
import { CardContent, CardDescription, CardHeader } from '../vendor/ui/card.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { documentationLayoutVariables } from '../layout/layout-variables.js';
import { ShadcnPageRail } from './page-rail.js';
import { usePageWidth } from './use-page-width.js';

export type ShadcnPageProps = PageProps;
export function ShadcnPage({
  title,
  subtitle,
  anchor,
  children,
  left,
  right,
}: PageProps) {
  const id = useId();
  const { height } = useContext(ShellLayoutContext);
  const level = useContext(HeadingLevelContext);
  const insideMain = useContext(MainScopeContext);
  const { setElement, widthRem, measured } = usePageWidth();
  const hasLeft = Children.toArray(left).length > 0;
  const hasRight = Children.toArray(right).length > 0;
  const headingId = anchor ?? `${id}-title`;
  return (
    <CardContent
      role={insideMain ? 'region' : 'main'}
      aria-labelledby={headingId}
      className="reacd-page min-w-0 p-0"
      style={{
        position: 'relative',
        ...documentationLayoutVariables,
        ...(height > 0 ? { '--shell-measured-height': `${height}px` } : {}),
      }}
    >
      <CardContent
        ref={setElement}
        aria-hidden="true"
        className="p-0"
        style={{
          position: 'absolute',
          insetInline: 0,
          insetBlockStart: 0,
          blockSize: `${POLICY.widthProbeBlockEm}em`,
          pointerEvents: 'none',
        }}
      />
      <MainScopeContext.Provider value={true}>
        <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
          <CardContent
            className="reacd-page-frame p-0"
            data-left={hasLeft ? true : undefined}
            data-right={hasRight ? true : undefined}
          >
            {hasLeft && (
              <CardContent
                role="complementary"
                aria-label={POLICY.navigationLabel}
                className="reacd-page-rail-left min-w-0 p-0"
              >
                <ShadcnPageRail
                  label={POLICY.navigationLabel}
                  wide={
                    measured
                      ? widthRem >= POLICY.leftRailAtRem
                      : POLICY.unmeasuredRailsExpanded
                  }
                >
                  {left}
                </ShadcnPageRail>
              </CardContent>
            )}
            <CardContent className="reacd-page-article min-w-0 p-0">
              <CardHeader className="space-y-0 gap-4 p-0">
                <ShadcnProseHeading level={level} id={headingId}>
                  {title}
                </ShadcnProseHeading>
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
              </CardHeader>
              {children}
            </CardContent>
            {hasRight && (
              <CardContent
                role="complementary"
                aria-label={POLICY.contentsLabel}
                className="reacd-page-rail-right min-w-0 p-0"
              >
                <ShadcnPageRail
                  label={POLICY.contentsLabel}
                  wide={
                    measured
                      ? widthRem >= POLICY.rightRailAtRem
                      : POLICY.unmeasuredRailsExpanded
                  }
                >
                  {right}
                </ShadcnPageRail>
              </CardContent>
            )}
          </CardContent>
        </HeadingLevelContext.Provider>
      </MainScopeContext.Provider>
    </CardContent>
  );
}
