import { Fragment } from 'react';
import type { ProseCode } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';
import { contrastRatio } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { useShadcnTheme } from '../surface/theme-context.js';

export function ShadcnProseCode({ node }: { readonly node: ProseCode }) {
  const theme = useShadcnTheme();
  const background =
    theme && '--background' in theme ? theme['--background'] : undefined;
  const dark =
    typeof background === 'string' &&
    contrastRatio(background, PROSE_POLICY.lightReference) >
      contrastRatio(background, PROSE_POLICY.darkReference);
  return (
    <pre
      className="my-6 min-w-0 overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm"
      role="region"
      aria-label={node.language || PROSE_POLICY.codeLabel}
      tabIndex={PROSE_POLICY.codeTabIndex}
    >
      <code>
        {node.tokens === undefined
          ? node.content
          : node.tokens.map((line, index) => (
              <Fragment key={index}>
                {index > 0 && '\n'}
                {line.map((token, position) => (
                  <span
                    key={position}
                    style={{ color: dark ? token.dark : token.light }}
                  >
                    {token.text}
                  </span>
                ))}
              </Fragment>
            ))}
      </code>
    </pre>
  );
}
