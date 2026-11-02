import '@fastsprout/reacd/styles';
import './fonts.css';
import { hydrateSite } from './hydration.js';
import type { SiteHost } from './actions.js';
import { renderSiteFailure } from './recovery.js';

export async function startSite(host: SiteHost): Promise<void> {
  try {
    await hydrateSite(host);
  } catch {
    renderSiteFailure(host.document, () => host.location.reload());
  }
}

await startSite(window);
