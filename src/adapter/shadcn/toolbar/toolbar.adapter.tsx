import type { ToolbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/toolbar/toolbar.props.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnToolbarProps = ToolbarProps;
export function ShadcnToolbar({ children, label }: ToolbarProps) {
  return (
    <CardContent
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-4 p-0"
    >
      {children}
    </CardContent>
  );
}
