import type { PageAsideProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-aside/page-aside.js';
import { useWidePage } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-aside/use-wide-page.js';

export function SharedPageAside({ children, label, top, bottom }: PageAsideProps) {
  const wide = useWidePage();
  return (
    <aside className="reacd-node reacd-page-aside" aria-label={label} data-wide={wide}>
      {top !== undefined && <div className="reacd-page-aside-top">{top}</div>}
      <div className="reacd-page-aside-body">{children}</div>
      {bottom !== undefined && <div className="reacd-page-aside-bottom">{bottom}</div>}
    </aside>
  );
}
