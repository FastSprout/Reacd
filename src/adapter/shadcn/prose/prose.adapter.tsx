import type { ProseProps } from
  '@fastsprout/reacd/adapter-runtime/components/prose/prose.props.js';
import { ShadcnProseBlocks } from './blocks.js';

export type ShadcnProseProps = ProseProps;
export function ShadcnProse({ document }: ShadcnProseProps) {
  return (
    <div className="min-w-0 [overflow-wrap:anywhere]">
      <ShadcnProseBlocks nodes={document} />
    </div>
  );
}
