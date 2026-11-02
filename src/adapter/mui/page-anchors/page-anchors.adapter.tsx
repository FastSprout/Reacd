import type { PageAnchorsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-anchors/page-anchors.props.js';
import { MuiPageNativeLinks } from '../page-links/native-links.js';

export type MuiPageAnchorsProps = PageAnchorsProps;

export function MuiPageAnchors(props: MuiPageAnchorsProps) {
  return <MuiPageNativeLinks {...props} />;
}
