import type { TextProps } from
  '@fastsprout/reacd/adapter-runtime/components/text/text.props.js';
import { TEXT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/text-policy.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../vendor/ui/collapsible.js';
import { Button } from '../vendor/ui/button.js';
import { CardDescription } from '../vendor/ui/card.js';

export function ShadcnFullText({ children }: Pick<TextProps, 'children'>) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button type="button" variant="link">
          {TEXT_POLICY.disclosureLabel}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardDescription className="min-w-0 [overflow-wrap:anywhere]">
          {children}
        </CardDescription>
      </CollapsibleContent>
    </Collapsible>
  );
}
