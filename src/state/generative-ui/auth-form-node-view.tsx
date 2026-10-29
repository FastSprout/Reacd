import type { ReactNode } from 'react';
import { AuthForm } from '../../components/auth-form/auth-form.js';
import { AUTH_FORM_DEFAULTS } from '../../core/auth-form-policy.js';
import type { AuthFormNode } from '../../schema/auth-form/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BooleanRead } from './boolean-read.js';

export function AuthFormNodeView({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: AuthFormNode<GenerativeNode>;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}) {
  const {
    type: _type,
    children,
    leading,
    header,
    footer,
    providers,
    submitAction,
    loading,
    disabled,
    ...properties
  } = node;
  const run = (action: string) => {
    const handler = Object.hasOwn(actions, action) ? actions[action] : undefined;
    if (typeof handler === 'function') handler({ state: registry });
  };
  return (
    <BooleanRead
      value={loading}
      fallback={AUTH_FORM_DEFAULTS.loading}
      registry={registry}
    >
      {(isLoading) => (
        <BooleanRead
          value={disabled}
          fallback={AUTH_FORM_DEFAULTS.disabled}
          registry={registry}
        >
          {(isDisabled) => (
            <AuthForm
              {...properties}
              loading={isLoading}
              disabled={isDisabled}
              leading={leading?.map(renderChild)}
              header={header?.map(renderChild)}
              footer={footer?.map(renderChild)}
              onSubmit={() => run(submitAction)}
              providers={providers?.map(({ action, ...provider }) => ({
                ...provider,
                onPress: () => run(action),
              }))}
            >
              {children.map(renderChild)}
            </AuthForm>
          )}
        </BooleanRead>
      )}
    </BooleanRead>
  );
}
