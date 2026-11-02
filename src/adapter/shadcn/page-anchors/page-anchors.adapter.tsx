import type { PageAnchorsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-anchors/page-anchors.props.js';
import { ShadcnPageNativeLinks } from '../page-links/native-links.js';

export type ShadcnPageAnchorsProps = PageAnchorsProps;

export function ShadcnPageAnchors(props: ShadcnPageAnchorsProps) {
  return <ShadcnPageNativeLinks {...props} />;
}
