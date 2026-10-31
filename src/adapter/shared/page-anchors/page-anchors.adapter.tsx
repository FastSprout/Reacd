import type { ReactNode } from 'react';
import type { PageAnchorsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-anchors/page-anchors.props.js';
import { PageLinksSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-links/page-links.renderer.js';

export function SharedPageAnchors(props: PageAnchorsProps): ReactNode {
  return <PageLinksSurface {...props} kind="anchors" />;
}
