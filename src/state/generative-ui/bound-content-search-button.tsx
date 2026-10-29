import { z } from 'zod';
import { useState } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import { ContentSearchButton } from '../../components/content-search-button/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
const SCHEMA = z.boolean();

export function BoundContentSearchButton({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'ContentSearchButton' }>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, node.open, TARGET, SCHEMA);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <ContentSearchButton
        label={node.label}
        disabled={node.disabled}
        open={result.data.value}
        onOpenChange={(value) => {
          const changed = result.data.write(value);
          setIssues(changed.success ? [] : changed.issues);
        }}
      />
    </>
  );
}
