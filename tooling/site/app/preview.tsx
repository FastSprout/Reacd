import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { ComponentType } from 'react';
import { atom, useAtom } from 'jotai';
import {
  ReacdProvider,
  Select,
  Spinner,
  VStack,
  createReacdStore,
} from '@fastsprout/reacd';
import type { ReacdStore, ThemeAdapter } from '@fastsprout/reacd';
import type { SiteSection } from '../content/model.js';
import { previewRegistry } from '../previews/registry.js';
import { recipeRegistry } from '../previews/recipes.js';
import { loadMaterialAdapter } from './material-adapter.js';
import { PreviewBoundary } from '../runtime/preview-boundary.js';
import type { DesignTemplate } from '@fastsprout/reacd';
import { previewTemplates } from './theme/preview-templates.js';

const subscribe = () => () => undefined;
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const adapterAtom = atom('shadcn');
const adapters = [
  { value: 'shadcn', label: 'shadcn/ui' },
  { value: 'mui', label: 'Material UI' },
];

function AdapterPreview({
  adapter,
  appearance,
  design,
  View,
  store,
}: {
  readonly adapter: string;
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
  readonly View: ComponentType;
  readonly store: ReacdStore;
}) {
  const [material, setMaterial] = useState<
    | { readonly status: 'loading' }
    | { readonly status: 'ready'; readonly adapter: ThemeAdapter }
    | { readonly status: 'failed'; readonly reason: unknown }
  >({ status: 'loading' });
  useEffect(() => {
    if (adapter !== 'mui') return;
    let active = true;
    void loadMaterialAdapter().then(
      (loaded) => {
        if (active) setMaterial({ status: 'ready', adapter: loaded });
      },
      (reason: unknown) => {
        if (active) setMaterial({ status: 'failed', reason });
      },
    );
    return () => {
      active = false;
    };
  }, [adapter]);
  let selected: ThemeAdapter | undefined;
  if (adapter === 'mui') {
    if (material.status === 'loading') return <Spinner label="Loading example" />;
    if (material.status === 'failed') throw material.reason;
    selected = material.adapter;
  }
  return (
    <ReacdProvider
      adapter={selected}
      store={store}
      templates={previewTemplates(appearance, design)}
    >
      <View />
    </ReacdProvider>
  );
}

function PreviewContent({
  entry,
  appearance,
  design,
}: {
  readonly entry: Extract<SiteSection, { type: 'preview' }>;
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
}) {
  const [adapter, setAdapter] = useAtom(adapterAtom);
  const store = useMemo(() => createReacdStore(), []);
  const selected = entry.component
    ? { name: entry.component, example: previewRegistry[entry.component] }
    : entry.example
      ? { name: entry.example, example: recipeRegistry[entry.example] }
      : null;
  if (!selected) throw new Error('A preview must identify an example.');
  const View = selected.example.View;
  return (
    <VStack>
      <Select
        label="Example adapter"
        value={adapter}
        onValueChange={setAdapter}
        items={adapters}
      />
      <PreviewBoundary key={adapter} name={selected.name}>
        <Suspense fallback={<Spinner label="Loading example" />}>
          <AdapterPreview
            adapter={adapter}
            appearance={appearance}
            design={design}
            View={View}
            store={store}
          />
        </Suspense>
      </PreviewBoundary>
    </VStack>
  );
}

export function LivePreview({
  entry,
  appearance,
  design,
}: {
  readonly entry: Extract<SiteSection, { type: 'preview' }>;
  readonly appearance: 'light' | 'dark';
  readonly design?: DesignTemplate | undefined;
}) {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return (
    <ReacdProvider templates={previewTemplates(appearance, design)}>
      <VStack>
        <Suspense fallback={<Spinner label="Loading example" />}>
          {ready ? (
            <PreviewContent entry={entry} appearance={appearance} design={design} />
          ) : (
            <Spinner label="Loading example" />
          )}
        </Suspense>
      </VStack>
    </ReacdProvider>
  );
}
