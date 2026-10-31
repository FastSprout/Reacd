import { Provider, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import type { z } from 'zod';
import { RenderContext } from '../../components/shared/port.js';
import {
  templateSchema,
  templates as defaults,
} from '../../schema/design/templates.schema.js';
import { createRenderPort } from '../../renderer/port/create-render-port.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { providerSchema } from './provider.schema.js';
import { createReacdStore } from '../store.js';
import { templateAtom } from '../theme/template.atom.js';
import { ApplicationContext } from '../application-context.js';

export function ActiveProvider({
  children,
  adapter,
  templateId: controlledTemplateId,
  templates = defaults,
  store,
}: z.infer<typeof providerSchema>) {
  const [localStore] = useState(createReacdStore);
  const activeStore = store ?? localStore;
  const storedTemplateId = useAtomValue(templateAtom, { store: activeStore });
  const templateId = controlledTemplateId ?? storedTemplateId;
  const port = useMemo(() => createRenderPort(adapter), [adapter]);
  const template = templateSchema.safeParse(
    Object.hasOwn(templates, templateId) ? templates[templateId] : undefined,
  );
  if (!template.success) {
    return (
      <Issues
        issues={[
          {
            path: 'ReacdProvider.templateId',
            message: `Template is not registered: ${templateId}.`,
          },
        ]}
      />
    );
  }
  return (
    <ApplicationContext.Provider
      value={{
        adapter,
        store: activeStore,
        templateId,
        templates,
      }}
    >
      <Provider store={activeStore}>
        <RenderContext.Provider value={port}>
          <adapter.Surface template={template.data} templateId={templateId}>
            {children}
          </adapter.Surface>
        </RenderContext.Provider>
      </Provider>
    </ApplicationContext.Provider>
  );
}
