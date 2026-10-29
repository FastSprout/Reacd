import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type RefObject,
} from 'react';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';

export function usePromptEscape(
  form: RefObject<HTMLFormElement | null>,
  composing: RefObject<boolean>,
  onClose: (() => void) | undefined,
  disabled: boolean,
) {
  const scope = useContext(EscapeScopeContext);
  const active = useContext(PortalActiveContext);
  const release = useRef<(() => void) | undefined>(undefined);
  const clear = useCallback(() => {
    const unregister = release.current;
    release.current = undefined;
    if (unregister !== undefined) unregister();
  }, []);
  const focus = () => {
    const element = form.current;
    if (
      element === null ||
      !element.contains(element.ownerDocument.activeElement) ||
      !active ||
      disabled ||
      onClose === undefined ||
      scope === null ||
      release.current !== undefined
    )
      return;
    release.current = scope.register(() => {
      if (!composing.current) onClose();
    });
  };
  const blur = useCallback(
    (event: FocusEvent<HTMLFormElement>) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !event.currentTarget.contains(next)) clear();
    },
    [clear],
  );
  useLayoutEffect(() => {
    focus();
    return clear;
  });
  return { focus, blur };
}
