import { renderToString } from 'react-dom/server';
import type { SitePayload } from '../app/model.js';
import { SiteDocument } from './document.js';
import { SITE_POLICY } from '../policy.js';

export const serverActions = {
  copyText: async () => undefined,
  readAppearance: () => 'light' as const,
  persistAppearance: () => undefined,
};

export function renderSiteDocument(
  payload: SitePayload,
  appearanceScript = '',
): string {
  return (
    '<!doctype html>' +
    renderToString(
      <SiteDocument
        payload={payload}
        actions={serverActions}
        appearanceScript={appearanceScript}
        initialStyles={null}
      />,
      {
        identifierPrefix: SITE_POLICY.rootIdentifier,
      },
    )
  );
}
