import { atom, useAtom } from 'jotai';
import { lazy } from 'react';
import {
  Link,
  Page,
  Select,
  Tabs,
  Toolbar,
  useDesignTemplate,
} from '@fastsprout/reacd';
import { Catalog } from './catalog/catalog.js';
import { DeferredView } from './loading/deferred-view.js';

const GenerativePlayground = lazy(() =>
  import('./generative/playground.js').then((module) => ({
    default: module.GenerativePlayground,
  })),
);

const panelAtom = atom('components');
const PANELS = [
  { value: 'components', label: 'Components' },
  { value: 'generative', label: 'Generative UI' },
];
const TEMPLATES = [
  { value: 'saas-modern-light', label: 'Spacious' },
  { value: 'erp-compact', label: 'Compact' },
];

export function Workbench() {
  const [panel, setPanel] = useAtom(panelAtom);
  const [template, setTemplate] = useDesignTemplate();
  return (
    <Page title="reacd" subtitle="Compose applications from typed components.">
      <Toolbar label="Workspace">
        <Select
          label="Appearance"
          value={template}
          items={TEMPLATES}
          onValueChange={setTemplate}
        />
        <Link label="Documentation" href="http://127.0.0.1:8000/" />
      </Toolbar>
      <Tabs
        label="Workspace views"
        value={panel}
        items={PANELS}
        onValueChange={setPanel}
      >
        {panel === 'components' ? (
          <Catalog />
        ) : (
          <DeferredView label="Generative UI">
            <GenerativePlayground />
          </DeferredView>
        )}
      </Tabs>
    </Page>
  );
}
