import { PAGE_FRAME_POLICY } from '../../core/page-navigation-policy.js';
import { createElement, useContext } from 'react';
import { HeadingLevelContext } from '../heading/heading-context.js';
import { headingTag } from '../heading/heading-tag.js';
import { PAGE_PRESENTATION_DEFAULTS } from '../../core/page-presentation-policy.js';

export function PageHeading({
  id,
  anchor,
  title,
  href,
  onPress,
  newWindow = PAGE_PRESENTATION_DEFAULTS.newWindow,
}: {
  id?: string | undefined;
  anchor?: string | undefined;
  title?: string | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  newWindow?: boolean | undefined;
}) {
  const level = useContext(HeadingLevelContext);
  if (title === undefined) return null;
  return createElement(
    headingTag(level),
    {
      className: 'reacd-page-title',
      id,
      tabIndex: anchor === undefined ? undefined : PAGE_FRAME_POLICY.anchorTabIndex,
      'data-reacd-anchor': anchor === undefined ? undefined : true,
    },
    href !== undefined ? (
      <a
        className="reacd-page-title-action"
        href={href}
        target={newWindow ? '_blank' : undefined}
        rel={newWindow ? 'noopener noreferrer' : undefined}
      >
        {title}
      </a>
    ) : onPress !== undefined ? (
      <button
        className="reacd-page-title-action"
        type="button"
        onClick={pressHandler(onPress)}
      >
        {title}
      </button>
    ) : (
      title
    ),
  );
}
import { pressHandler } from '../contracts/press-handler.js';
