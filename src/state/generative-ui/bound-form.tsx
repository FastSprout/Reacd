import type { ReactNode } from 'react';
import type { z } from 'zod';
import { Form } from '../../components/form/index.js';
import { FORM_SUBMIT_POLICY } from '../../core/form-submit-policy.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { FormNode } from '../../schema/form/index.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { readStateBindingSchema } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

type ViewNode = Omit<FormNode<unknown>, 'children'>;
interface BoundFormProps {
  readonly node: ViewNode;
  readonly registry: StateRegistry;
  readonly actions: GenerativeActions;
  readonly children: ReactNode;
}
const TARGET = { kinds: ['boolean'], mode: 'read' } as const;

function BoundFormFlag({
  node,
  registry,
  actions,
  children,
  property,
  reference,
}: BoundFormProps & {
  readonly property: 'disabled' | 'submitting';
  readonly reference: z.infer<typeof readStateBindingSchema>;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <BoundForm
      node={{ ...node, [property]: result.data.value }}
      registry={registry}
      actions={actions}
    >
      {children}
    </BoundForm>
  );
}

export function BoundForm({ node, registry, actions, children }: BoundFormProps) {
  if (typeof node.disabled === 'object') {
    return (
      <BoundFormFlag
        node={node}
        registry={registry}
        actions={actions}
        property="disabled"
        reference={node.disabled}
      >
        {children}
      </BoundFormFlag>
    );
  }
  if (typeof node.submitting === 'object') {
    return (
      <BoundFormFlag
        node={node}
        registry={registry}
        actions={actions}
        property="submitting"
        reference={node.submitting}
      >
        {children}
      </BoundFormFlag>
    );
  }
  const handler = Object.hasOwn(actions, node.submitAction)
    ? actions[node.submitAction]
    : undefined;
  if (typeof handler !== 'function')
    return (
      <Issues
        issues={[
          {
            path: 'Form.submitAction',
            message: FORM_SUBMIT_POLICY.missingActionMessage,
          },
        ]}
      />
    );
  const {
    type: _type,
    submitAction: _action,
    disabled,
    submitting,
    ...properties
  } = node;
  return (
    <Form
      {...properties}
      disabled={disabled}
      submitting={submitting}
      onSubmit={() => {
        const current = Object.hasOwn(actions, node.submitAction)
          ? actions[node.submitAction]
          : undefined;
        if (typeof current === 'function') current({ state: registry });
      }}
    >
      {children}
    </Form>
  );
}
