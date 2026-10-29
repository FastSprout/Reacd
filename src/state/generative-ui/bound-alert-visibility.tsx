import { useMemo } from 'react';
import { z } from 'zod';
import { Alert } from '../../components/alert/alert.js';
import type { AlertNodeDeclaration } from '../../schema/alert/generative.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { alertProperties } from './alert-properties.js';
import { useBoundValue } from './use-bound-value.js';

const VALUE = z.boolean();
export function BoundAlertVisibility({
  node,
  reference,
  registry,
  actions,
}: {
  node: Omit<AlertNodeDeclaration, 'type' | 'open'>;
  reference: StateBindingReference;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const target = useMemo(
    () => ({ kinds: ['boolean'] as const, mode: reference.mode }),
    [reference.mode],
  );
  const result = useBoundValue(registry, reference, target, VALUE);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Alert
      {...alertProperties(
        node,
        registry,
        actions,
        result.data.value,
        reference.mode === 'read' ? undefined : result.data.write,
      )}
    />
  );
}
