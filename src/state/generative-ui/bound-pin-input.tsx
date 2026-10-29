import { useMemo, useRef } from 'react';
import type { z } from 'zod';
import { PinInput } from '../../components/pin-input/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { pinInputNodeSchema } from '../../schema/pin-input/generative.schema.js';
import { pinValueSchema } from '../../schema/pin-input/pin-input.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundPinInput({
  node,
  registry,
  actions,
}: {
  node: z.infer<typeof pinInputNodeSchema>;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => pinValueSchema(node.length, node.inputType),
    [node.length, node.inputType],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  const acceptedWrite = useRef(false);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, completeAction, readOnly, ...properties } = node;
  return (
    <PinInput
      {...properties}
      value={result.data.value}
      readOnly={readOnly || node.value.mode === 'read'}
      onValueChange={(value) => {
        acceptedWrite.current = result.data.write(value).success;
      }}
      onComplete={() => {
        if (!acceptedWrite.current || completeAction === undefined) return;
        const handler = Object.hasOwn(actions, completeAction)
          ? actions[completeAction]
          : undefined;
        if (typeof handler === 'function') handler({ state: registry });
      }}
    />
  );
}
