import { useContext, useId } from 'react';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import {
  nextHeadingLevel,
  sectionHeadingLevel,
} from '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import type { SectionProps } from
  '@fastsprout/reacd/adapter-runtime/components/section/section.props.js';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../vendor/ui/card.js';

export type ShadcnSectionProps = SectionProps;
export function ShadcnSection({ title, description, anchor, children }: SectionProps) {
  const id = useId();
  const level = sectionHeadingLevel(useContext(HeadingLevelContext));
  return (
    <CardContent
      id={anchor}
      role="region"
      aria-labelledby={`${id}-title`}
      className="grid min-w-0 grid-cols-1 gap-4 p-0"
    >
      <CardHeader className="p-0">
        <CardTitle id={`${id}-title`} role="heading" aria-level={level}>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <HeadingLevelContext.Provider value={nextHeadingLevel(level)}>
        {children}
      </HeadingLevelContext.Provider>
    </CardContent>
  );
}
