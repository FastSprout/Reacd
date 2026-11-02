import { useContext, useId } from 'react';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { headingTag } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-tag.js';
import {
  nextHeadingLevel,
  sectionHeadingLevel,
} from '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PAGE_FRAME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-navigation-policy.js';

export function useMaterialHeading(title?: string, anchor?: string, section = false) {
  const inherited = useContext(HeadingLevelContext);
  const generatedId = useId();
  const level = section ? sectionHeadingLevel(inherited) : inherited;
  const id = anchor ?? generatedId;
  return {
    component: headingTag(level),
    labelId: title === undefined ? undefined : id,
    descendants: title === undefined ? level : nextHeadingLevel(level),
    attributes: {
      id,
      tabIndex: anchor === undefined ? undefined : PAGE_FRAME_POLICY.anchorTabIndex,
      'data-reacd-anchor': anchor === undefined ? undefined : true,
    },
  };
}
