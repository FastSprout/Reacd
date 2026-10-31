import type { PageBodyProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-body/page-body.js';

export function SharedPageBody({ children }: PageBodyProps) {
  return <div className="reacd-node reacd-page-body">{children}</div>;
}
