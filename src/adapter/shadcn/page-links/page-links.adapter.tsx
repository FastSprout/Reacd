import type { ReactNode } from 'react';
import type { PageLinksProps }
  from '../../../components/page-links/page-links.props.js';
import { PageLinksSurface } from '../../../renderer/page-links/page-links.renderer.js';

export function ShadcnPageLinks(props: PageLinksProps): ReactNode {
  return <PageLinksSurface {...props} kind="links" />;
}
