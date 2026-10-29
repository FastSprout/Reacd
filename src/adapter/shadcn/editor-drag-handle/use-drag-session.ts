import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
interface DragOwner {
  readonly id: string;
  readonly cancel: () => void;
}
export function useDragSession(id: string | undefined, blocked: boolean) {
  const owner = useRef<DragOwner | null>(null);
  const finish = useCallback(() => {
    const previous = owner.current;
    owner.current = null;
    previous?.cancel();
    return previous !== null;
  }, []);
  useEffect(
    () => () => {
      finish();
    },
    [finish],
  );
  useLayoutEffect(() => {
    if (owner.current && (owner.current.id !== id || blocked)) finish();
  }, [id, blocked, finish]);
  function start(session: DragOwner): void {
    finish();
    owner.current = session;
  }
  return { start, finish };
}
