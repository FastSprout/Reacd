import type { FooterProps } from
  '@fastsprout/reacd/adapter-runtime/components/footer/footer.props.js';
import { CardContent, CardFooter } from '../vendor/ui/card.js';

export type ShadcnFooterProps = FooterProps;
export function ShadcnFooter({ top, start, children, end, bottom }: FooterProps) {
  return (
    <CardContent role="contentinfo" className="grid min-w-0 gap-4 p-0">
      {top}
      <CardFooter className="flex-wrap justify-between gap-4 p-0">
        {start}
        {children}
        {end}
      </CardFooter>
      {bottom}
    </CardContent>
  );
}
