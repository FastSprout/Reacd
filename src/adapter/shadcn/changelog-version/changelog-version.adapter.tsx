import { useContext } from 'react';
import { CircleIcon } from 'lucide-react';
import type { ChangelogVersionProps } from
  '@fastsprout/reacd/adapter-runtime/components/changelog-version/index.js';
import { EDITORIAL_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';
import { Badge } from '../vendor/ui/badge.js';
import { ShadcnBlogPost } from '../blog-post/blog-post.adapter.js';
import { ChangelogIndicatorContext } from './indicator-context.js';

export type ShadcnChangelogVersionProps = ChangelogVersionProps;
export function ShadcnChangelogVersion({ indicator, ...props }: ChangelogVersionProps) {
  const inherited = useContext(ChangelogIndicatorContext);
  const visible = indicator ?? inherited;
  const header =
    visible || props.header !== undefined ? (
      <>
        {visible && (
          <Badge variant="secondary" aria-hidden>
            <CircleIcon
              aria-hidden
              style={{
                inlineSize: `${EDITORIAL_POLICY.indicatorRem}rem`,
                blockSize: `${EDITORIAL_POLICY.indicatorRem}rem`,
              }}
            />
          </Badge>
        )}
        {props.header}
      </>
    ) : undefined;
  return <ShadcnBlogPost {...props} header={header} />;
}
