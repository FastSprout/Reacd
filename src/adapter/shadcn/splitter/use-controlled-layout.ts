import { useEffect, useRef } from 'react';
import { useGroupRef } from 'react-resizable-panels';
import type { GroupProps, GroupImperativeHandle } from 'react-resizable-panels';
import type { SplitterProps } from
  '@fastsprout/reacd/adapter-runtime/components/splitter/index.js';
import { declaredLayout, sdkLayout } from './layout.js';

function reconcile(
  group: GroupImperativeHandle | null,
  prefix: string,
  value: SplitterProps['value'],
) {
  if (group === null) return;
  const current = group.getLayout();
  const requested = sdkLayout(prefix, value);
  const keys = Object.keys(requested);
  if (
    Object.keys(current).length === keys.length &&
    keys.every((key) => Object.hasOwn(current, key))
  ) group.setLayout(requested);
}

export function useControlledLayout(
  prefix: string,
  properties: SplitterProps,
  blocked: boolean,
) {
  const groupRef = useGroupRef();
  const accepted = useRef(properties.value);
  const frame = useRef<number | undefined>(undefined);
  useEffect(() => {
    accepted.current = properties.value;
    reconcile(groupRef.current, prefix, properties.value);
  }, [prefix, properties.value, groupRef]);
  useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const onLayoutChanged: GroupProps['onLayoutChanged'] = (layout, metadata) => {
    if (!metadata.isUserInteraction) {
      reconcile(groupRef.current, prefix, accepted.current);
      return;
    }
    if (blocked) return;
    const candidate = declaredLayout(prefix, layout, properties.panels);
    if (candidate.success) properties.onValueChange(candidate.data);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      reconcile(groupRef.current, prefix, accepted.current);
    });
  };
  return { groupRef, onLayoutChanged };
}
