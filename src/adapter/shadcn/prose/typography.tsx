import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { HeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { headingTag } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-tag.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';

const HEADING_RECIPES = {
  1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
  2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  5: 'scroll-m-20 text-lg font-semibold',
  6: 'scroll-m-20 text-sm font-medium leading-none',
} as const;

interface HeadingProps {
  readonly level: HeadingLevel;
  readonly id?: string | undefined;
  readonly children: ReactNode;
}

export function ShadcnProseHeading({ level, id, children }: HeadingProps) {
  return createElement(
    headingTag(level),
    {
      className: HEADING_RECIPES[level],
      id,
      tabIndex: id === undefined ? undefined : PROSE_POLICY.headingTabIndex,
    },
    children,
  );
}
