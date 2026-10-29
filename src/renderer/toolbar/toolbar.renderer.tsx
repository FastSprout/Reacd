import type { ToolbarProps } from '../../components/toolbar/toolbar.js';

export function ToolbarSurface({ children, label }: ToolbarProps) {
  return (
    <div className="reacd-node reacd-toolbar" role="group" aria-label={label}>
      {children}
    </div>
  );
}
