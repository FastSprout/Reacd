import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Carousel } from '../../components/carousel/index.js';
import { carouselValueSchema } from '../../schema/carousel/index.js';
import type { CarouselNode } from '../../schema/carousel/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

export function CarouselNodeView({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: CarouselNode<GenerativeNode>;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}) {
  const target = useMemo(
    () => ({ kinds: ['number'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => carouselValueSchema(node.items.length),
    [node.items.length],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    value: _value,
    items,
    retryAction,
    readOnly,
    ...properties
  } = node;
  const onRetry =
    retryAction === undefined
      ? undefined
      : () => {
          const handler = Object.hasOwn(actions, retryAction)
            ? actions[retryAction]
            : undefined;
          if (typeof handler === 'function') handler({ state: registry });
        };
  return (
    <Carousel
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      onRetry={onRetry}
      readOnly={readOnly || node.value.mode === 'read'}
      items={items.map((item) => ({
        ...item,
        children: item.children.map(renderChild),
      }))}
    />
  );
}
