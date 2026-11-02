import type { TextProps } from
  '@fastsprout/reacd/adapter-runtime/components/text/text.props.js';
import { useContext } from 'react';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { textHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/text-heading.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { CardContent, CardDescription, CardTitle } from '../vendor/ui/card.js';
import { cn } from '../vendor/lib/utils.js';
import { ShadcnFullText } from './full-text.js';

export type ShadcnTextProps = TextProps;
const roles = {
  headline: 'text-2xl font-semibold',
  subheadline: 'text-lg font-semibold',
  body: 'text-base text-foreground',
  caption: 'text-sm text-muted-foreground',
  display: 'text-4xl font-bold',
};
const weights = { normal: 'font-normal', medium: 'font-medium', bold: 'font-bold' };
export function ShadcnText({
  children,
  role = DEFAULTS.textRole,
  weight,
  lineLimit,
}: TextProps) {
  const level = textHeadingLevel(role, useContext(HeadingLevelContext));
  const Component =
    role === 'headline' || role === 'subheadline' || role === 'display'
      ? CardTitle
      : CardDescription;
  const text = (
    <Component
      role={level === undefined ? undefined : 'heading'}
      aria-level={level}
      className={cn('min-w-0 break-words', roles[role], weight && weights[weight])}
      style={
        lineLimit
          ? {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: lineLimit,
              overflow: 'hidden',
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
  if (lineLimit === undefined) return text;
  return (
    <CardContent className="min-w-0 p-0">
      {text}
      <ShadcnFullText>{children}</ShadcnFullText>
    </CardContent>
  );
}
