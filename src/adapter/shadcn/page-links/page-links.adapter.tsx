import type { PageLinksProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-links/page-links.props.js';
import { useContext } from 'react';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { sectionHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { ShadcnPageNativeLinks } from './native-links.js';
import { ShadcnProseHeading } from '../prose/typography.js';

export type ShadcnPageLinksProps = PageLinksProps;

export function ShadcnPageLinks(props: ShadcnPageLinksProps) {
  const level = sectionHeadingLevel(useContext(HeadingLevelContext));
  return (
    <>
      {props.title && (
        <ShadcnProseHeading level={level}>{props.title}</ShadcnProseHeading>
      )}
      <ShadcnPageNativeLinks {...props} />
    </>
  );
}
