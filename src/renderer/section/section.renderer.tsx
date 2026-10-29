import { PAGE_FRAME_POLICY } from '../../core/page-navigation-policy.js';
import { createElement, useContext, useId } from 'react';
import type { SectionProps } from '../../components/section/section.js';
import { HeadingLevelContext } from '../heading/heading-context.js';
import { headingTag } from '../heading/heading-tag.js';
import { nextHeadingLevel, sectionHeadingLevel } from '../../core/heading-policy.js';

export function SectionSurface({ children, title, description, anchor }: SectionProps) {
  const generatedId = useId();
  const id = anchor ?? generatedId;
  const level = sectionHeadingLevel(useContext(HeadingLevelContext));
  return (
    <section className="reacd-node reacd-vstack" aria-labelledby={id}>
      {createElement(
        headingTag(level),
        {
          className: 'reacd-section-title',
          id,
          tabIndex: anchor === undefined ? undefined : PAGE_FRAME_POLICY.anchorTabIndex,
          'data-reacd-anchor': anchor === undefined ? undefined : true,
        },
        title,
      )}
      {description !== undefined && <p>{description}</p>}
      <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
        {children}
      </HeadingLevelContext.Provider>
    </section>
  );
}
