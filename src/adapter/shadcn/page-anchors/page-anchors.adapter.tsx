import type { ReactNode } from 'react';
import type { PageAnchorsProps }
  from '../../../components/page-anchors/page-anchors.props.js';
import { PageLinksSurface } from '../../../renderer/page-links/page-links.renderer.js';

export function ShadcnPageAnchors(props: PageAnchorsProps): ReactNode {
  return <PageLinksSurface {...props} kind="anchors" />;
}
