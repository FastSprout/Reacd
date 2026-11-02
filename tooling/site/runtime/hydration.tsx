import { hydrateRoot } from 'react-dom/client';
import { sitePayloadSchema } from '../content/model.schema.js';
import { SITE_POLICY } from '../policy.js';
import { browserActions } from './actions.js';
import type { SiteHost } from './actions.js';
import { SiteDocument } from './document.js';

export async function hydrateSite(host: SiteHost): Promise<void> {
  const base = new URL(host.location.href);
  if (!base.pathname.endsWith('/') && !base.pathname.endsWith('.html')) {
    base.pathname += '/';
  }
  const response = await host.fetch(new URL(SITE_POLICY.pageDataName, base));
  if (!response.ok) throw new Error('The documentation page could not be loaded.');
  const value: unknown = await response.json();
  const payload = sitePayloadSchema.parse(value);
  const route = new URL('.', base).pathname;
  if (payload.page.route !== route) {
    throw new Error('The documentation payload does not match this page.');
  }
  hydrateRoot(
    host.document,
    <SiteDocument
      payload={payload}
      actions={browserActions(host)}
      initialStyles={
        host.document.getElementById(SITE_POLICY.initialDesignId)?.textContent ?? null
      }
      appearanceScript={
        host.document.getElementById(SITE_POLICY.appearanceScriptId)?.textContent ?? ''
      }
    />,
    { identifierPrefix: SITE_POLICY.rootIdentifier },
  );
}
