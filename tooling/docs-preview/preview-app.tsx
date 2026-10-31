import { muiAdapter } from '@fastsprout/reacd-mui';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { Suspense, useMemo } from 'react';
import type { ReactNode } from 'react';
import { atom, useAtom } from 'jotai';
import {
  Alert,
  App,
  ReacdProvider,
  Section,
  Skeleton,
  Toggle,
  Toolbar,
  createReacdStore,
} from '@fastsprout/reacd';
import { DOCS_PREVIEW_POLICY } from '../../src/core/docs-preview-policy.js';
import { PreviewBoundary } from './boundary.js';
import { previewRegistry } from './registry.js';
import { readPreviewRequest } from './request.js';
import type { PreviewRequest } from './request.js';

function Example({
  component,
  template,
  direction,
  adapter,
}: PreviewRequest): ReactNode {
  const store = useMemo(() => createReacdStore(), []);
  const compactAtom = useMemo(() => atom(template === 'erp-compact'), [template]);
  const materialAtom = useMemo(() => atom(adapter === 'mui'), [adapter]);
  const [material, setMaterial] = useAtom(materialAtom, { store });
  const directionAtom = useMemo(() => atom(direction === 'rtl'), [direction]);
  const [compact, setCompact] = useAtom(compactAtom, { store });
  const [rtl, setRtl] = useAtom(directionAtom, { store });
  const View = previewRegistry[component].View;
  return (
    <ReacdProvider
      adapter={material ? muiAdapter : shadcnAdapter}
      store={store}
      templateId={compact ? 'erp-compact' : DOCS_PREVIEW_POLICY.defaultTemplate}
    >
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Section title={`${component} live example`}>
          <Toolbar label="Preview controls">
            <Toggle
              label="Material UI preview"
              checked={material}
              onCheckedChange={setMaterial}
            />
            <Toggle
              label="Compact preview"
              checked={compact}
              onCheckedChange={setCompact}
            />
            <Toggle
              label="Right to left preview"
              checked={rtl}
              onCheckedChange={setRtl}
            />
          </Toolbar>
          <PreviewBoundary key={component} name={component}>
            <Suspense fallback={<Skeleton label={`Loading ${component} example`} />}>
              <View />
            </Suspense>
          </PreviewBoundary>
        </Section>
      </App>
    </ReacdProvider>
  );
}

export function DocumentationPreview({
  search,
  initialAdapter = 'shadcn',
}: {
  readonly search: string;
  readonly initialAdapter?: 'shadcn' | 'mui';
}): ReactNode {
  const request = readPreviewRequest(search);
  if (request === null) {
    return (
      <ReacdProvider
        adapter={shadcnAdapter}
        templateId={DOCS_PREVIEW_POLICY.defaultTemplate}
      >
        <App>
          <Alert
            intent="error"
            title="Unknown documentation preview"
            message="Open a registered component example from the documentation."
          />
        </App>
      </ReacdProvider>
    );
  }
  return <Example {...request} adapter={request.adapter ?? initialAdapter} />;
}
