import type { SiteActions, SitePayload } from '../app/model.js';
import { SiteApplication } from '../app/site.js';
import { SITE_POLICY } from '../policy.js';
import { DEFAULT_DESIGN_PREFERENCES } from '../design/preferences.js';
import { initialDesignStyles } from './initial-design.js';

export function SiteDocument({
  payload,
  actions,
  appearanceScript,
  initialStyles,
}: {
  readonly payload: SitePayload;
  readonly actions: SiteActions;
  readonly appearanceScript: string;
  readonly initialStyles: string | null;
}) {
  const canonical = new URL(payload.page.route, payload.origin).href;
  return (
    <html lang="en" data-reacd-boot="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${payload.page.title} · ${payload.title}`}</title>
        <meta name="description" content={payload.page.description} />
        <link rel="canonical" href={canonical} />
        <style id={SITE_POLICY.initialDesignId}>
          {initialStyles ??
            initialDesignStyles(
              actions.readAppearance(),
              actions.readDesign?.() ?? DEFAULT_DESIGN_PREFERENCES,
            )}
        </style>
        <script id={SITE_POLICY.appearanceScriptId}>{appearanceScript}</script>
        <link rel="stylesheet" href={SITE_POLICY.runtimeStyles} />
      </head>
      <body>
        <div id={SITE_POLICY.rootId}>
          <SiteApplication payload={payload} actions={actions} />
        </div>
        <script type="module" src={SITE_POLICY.runtimeScript} />
      </body>
    </html>
  );
}
