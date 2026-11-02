import { useContext } from 'react';
import type { PageFeatureProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-feature/page-feature.props.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { PAGE_PRESENTATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import { Button } from '../vendor/ui/button.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnPageFeatureProps = PageFeatureProps;
export function ShadcnPageFeature({
  title,
  description,
  leading,
  children,
  href,
  onPress,
  newWindow,
  orientation = PAGE_PRESENTATION_DEFAULTS.featureOrientation,
}: PageFeatureProps) {
  const level = useContext(HeadingLevelContext);
  const field = useNativeField({});
  return (
    <CardContent
      className="flex min-w-0 max-w-full flex-wrap p-0"
      style={{
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: 'var(--space-medium)',
        overflowWrap: 'anywhere',
      }}
    >
      {leading}
      <CardContent className="grid min-w-0 p-0" style={{ gap: 'var(--space-small)' }}>
        {title && (
          <ShadcnProseHeading level={level}>
            {href ? (
              <Button
                asChild
                variant="link"
                className="h-auto min-w-0 max-w-full whitespace-normal p-0"
                style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
              >
                <a
                  href={href}
                  target={newWindow ? '_blank' : undefined}
                  rel={newWindow ? 'noopener noreferrer' : undefined}
                >
                  {title}
                </a>
              </Button>
            ) : onPress ? (
              <Button
                type="button"
                variant="link"
                className="h-auto min-w-0 max-w-full whitespace-normal"
                disabled={field.blocked}
                style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
                onClick={() => onPress()}
              >
                {title}
              </Button>
            ) : (
              title
            )}
          </ShadcnProseHeading>
        )}
        {description && <CardDescription>{description}</CardDescription>}
        <HeadingLevelContext value={title ? nextHeadingLevel(level) : level}>
          {children}
        </HeadingLevelContext>
      </CardContent>
    </CardContent>
  );
}
