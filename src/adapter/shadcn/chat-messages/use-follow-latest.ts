import { useLayoutEffect, useRef, useState } from 'react';
import { CHAT_POLICY } from '../../../core/chat-policy.js';

export function useFollowLatest(enabled: boolean, revision: object, status: string) {
  const viewport = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const [showLatest, setShowLatest] = useState(false);

  function follow() {
    const element = viewport.current;
    if (element === null) return;
    element.scrollTop = element.scrollHeight;
    following.current = true;
    setShowLatest(false);
    return element;
  }

  function latest() {
    follow()?.focus({ preventScroll: true });
  }

  function scroll() {
    const element = viewport.current;
    if (element === null || !enabled) return;
    following.current =
      element.scrollHeight - element.scrollTop - element.clientHeight <=
      CHAT_POLICY.bottomDistancePx;
    setShowLatest(!following.current);
  }

  useLayoutEffect(() => {
    if (enabled && following.current) follow();
  }, [enabled, revision, status]);

  return { viewport, latest, scroll, showLatest: enabled && showLatest };
}
