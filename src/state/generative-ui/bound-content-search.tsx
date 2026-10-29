import { z } from 'zod';
import type { ReactNode } from 'react';
import { ContentSearch } from '../../components/content-search/index.js';
import { CONTENT_SEARCH_DEFAULTS } from '../../core/content-search-policy.js';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useCommandModel } from './use-command-model.js';
import { useBoundValue } from './use-bound-value.js';

const OPEN_TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
const OPEN_SCHEMA = z.boolean();

export function BoundContentSearch({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: Extract<GenerativeNode, { type: 'ContentSearch' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  const {
    type: _type,
    open,
    title,
    description,
    triggerLabel,
    closeLabel,
    closeOnSelect = CONTENT_SEARCH_DEFAULTS.closeOnSelect,
    footer,
    ...command
  } = node;
  const visibility = useBoundValue(registry, open, OPEN_TARGET, OPEN_SCHEMA);
  const model = useCommandModel({
    node: { ...command, type: 'CommandPalette' },
    registry,
    actions,
  });
  if (!visibility.success) return <Issues issues={visibility.issues} />;
  if (!model.success) return <Issues issues={model.issues} />;
  return (
    <ContentSearch
      {...model.data.properties}
      title={title}
      description={description}
      triggerLabel={triggerLabel}
      closeLabel={closeLabel}
      open={visibility.data.value}
      closeOnSelect={false}
      onOpenChange={(value) => {
        const result = visibility.data.write(value);
        model.data.report(result.success ? [] : result.issues);
      }}
      onSelect={(key) => {
        const result = registry.transaction([
          ...(node.selection === undefined
            ? []
            : [
                {
                  key: node.selection.state,
                  value: key,
                },
              ]),
          ...(closeOnSelect ? [{ key: open.state, value: false }] : []),
        ]);
        model.data.report(result.success ? [] : result.issues);
        return result.success;
      }}
      footer={
        <>
          {footer?.map(renderChild)}
          {model.data.issues.length > 0 && <Issues issues={model.data.issues} />}
        </>
      }
    />
  );
}
