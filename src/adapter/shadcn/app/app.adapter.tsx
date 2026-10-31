import { DirectionProvider } from '@base-ui/react/direction-provider';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import type { AppProps } from '@fastsprout/reacd/adapter-runtime/components/app/app.js';
import { APPLICATION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/application-shell-policy.js';

export function ShadcnApp({
  children,
  direction = APPLICATION_DEFAULTS.direction,
  language = APPLICATION_DEFAULTS.language,
}: AppProps) {
  return (
    <DirectionProvider direction={direction}>
      <RadixDirectionProvider dir={direction}>
        <div className="reacd-node reacd-app" dir={direction} lang={language}>
          {children}
        </div>
      </RadixDirectionProvider>
    </DirectionProvider>
  );
}
