import { ShadcnShellLayout } from '../layout/shell-layout-context.js';
import { DirectionProvider } from '@radix-ui/react-direction';
import type { AppProps } from
  '@fastsprout/reacd/adapter-runtime/components/app/app.props.js';
import { CardContent } from '../vendor/ui/card.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';

export type ShadcnAppProps = AppProps;
export function ShadcnApp({
  children,
  direction = APPLICATION_DEFAULTS.direction,
  language = APPLICATION_DEFAULTS.language,
}: AppProps) {
  return (
    <DirectionProvider dir={direction}>
      <ShadcnShellLayout>
        <CardContent dir={direction} lang={language} className="min-w-0 p-0">
          {children}
        </CardContent>
      </ShadcnShellLayout>
    </DirectionProvider>
  );
}
