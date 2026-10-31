import type { FooterProps } from
  '@fastsprout/reacd/adapter-runtime/components/footer/footer.js';

export function ShadcnFooter({ children, start, end, top, bottom }: FooterProps) {
  return (
    <footer className="reacd-node reacd-footer">
      {top !== undefined && <div className="reacd-shell-band">{top}</div>}
      <div className="reacd-container reacd-shell-row">
        <div className="reacd-shell-start">{start}</div>
        <div className="reacd-shell-center">{children}</div>
        <div className="reacd-shell-end">{end}</div>
      </div>
      {bottom !== undefined && <div className="reacd-shell-band">{bottom}</div>}
    </footer>
  );
}
