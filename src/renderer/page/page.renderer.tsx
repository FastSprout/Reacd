import type { PageProps } from '../../components/page/page.js';
import { PAGE_FRAME_POLICY } from '../../core/page-navigation-policy.js';
import { createElement, useContext, useId } from 'react';
import { MainScopeContext } from '../main/main-scope.js';
import { HeadingLevelContext } from '../heading/heading-context.js';
import { headingTag } from '../heading/heading-tag.js';
import { nextHeadingLevel } from '../../core/heading-policy.js';

export function PageSurface({
  children,
  title,
  subtitle,
  anchor,
  left,
  right,
}: PageProps) {
  const generatedId = useId();
  const id = anchor ?? generatedId;
  const nested = useContext(MainScopeContext);
  const level = useContext(HeadingLevelContext);
  const Root = nested ? 'section' : 'main';
  return (
    <Root className="reacd-node reacd-page" aria-labelledby={id}>
      <header className="reacd-page-header">
        {createElement(
          headingTag(level),
          {
            id,
            tabIndex:
              anchor === undefined ? undefined : PAGE_FRAME_POLICY.anchorTabIndex,
            'data-reacd-anchor': anchor === undefined ? undefined : true,
          },
          title,
        )}
        {subtitle !== undefined && <p>{subtitle}</p>}
      </header>
      <MainScopeContext.Provider value={true}>
        <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
          <div className="reacd-page-frame">
            {left !== undefined && <div className="reacd-page-frame-side">{left}</div>}
            <div className="reacd-page-frame-body">{children}</div>
            {right !== undefined && (
              <div className="reacd-page-frame-side">{right}</div>
            )}
          </div>
        </HeadingLevelContext.Provider>
      </MainScopeContext.Provider>
    </Root>
  );
}
