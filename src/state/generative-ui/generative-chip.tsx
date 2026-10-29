import type { ReactNode } from 'react';
import { z } from 'zod';
import { Chip } from '../../components/chip/chip.js';
import { chipTextSchema } from '../../schema/chip/chip.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { ResolveReadValue } from './resolve-read-value.js';

const TEXT_SCHEMA = chipTextSchema.optional();
const SHOW_SCHEMA = z.boolean().optional();
const TEXT_KINDS = ['text', 'number'] as const;
const SHOW_KINDS = ['boolean'] as const;
export function GenerativeChip({
  node,
  registry,
  children,
}: {
  node: Extract<GenerativeNode, { type: 'Chip' }>;
  registry: StateRegistry;
  children: ReactNode;
}) {
  const { type: _type, text, show, children: _children, ...properties } = node;
  return (
    <ResolveReadValue
      registry={registry}
      kinds={TEXT_KINDS}
      schema={TEXT_SCHEMA}
      reference={typeof text === 'object' ? text : undefined}
      literal={typeof text === 'object' ? undefined : text}
    >
      {(resolvedText) => (
        <ResolveReadValue
          registry={registry}
          kinds={SHOW_KINDS}
          schema={SHOW_SCHEMA}
          reference={typeof show === 'object' ? show : undefined}
          literal={typeof show === 'object' ? undefined : show}
        >
          {(resolvedShow) => (
            <Chip {...properties} text={resolvedText} show={resolvedShow}>
              {children}
            </Chip>
          )}
        </ResolveReadValue>
      )}
    </ResolveReadValue>
  );
}
