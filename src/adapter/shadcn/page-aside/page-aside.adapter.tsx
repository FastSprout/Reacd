import { useContext } from 'react';
import type { PageAsideProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-aside/page-aside.props.js';
import { ShellLayoutContext } from '../layout/shell-layout-context.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnPageAsideProps = PageAsideProps;
export function ShadcnPageAside({ label, top, children, bottom }: PageAsideProps) {
  const { height } = useContext(ShellLayoutContext);
  const style = {
    top: height,
    '--aside-top': `${height}px`,
    gap: 'var(--space-medium)',
    overflowWrap: 'anywhere' as const,
  };
  return (
    <CardContent
      role="complementary"
      aria-label={label}
      className={[
        'grid min-w-0 p-0 md:sticky md:self-start md:overflow-y-auto',
        'md:max-h-[calc(100dvh-var(--aside-top))]',
      ].join(' ')}
      style={style}
    >
      {top}
      {children}
      {bottom}
    </CardContent>
  );
}
