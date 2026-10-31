import { useEffect, useRef } from 'react';

interface ReasoningDisclosure {
  open: boolean;
  streaming: boolean;
  disabled: boolean;
  autoOpen: boolean;
  autoClose: boolean;
  onOpenChange: (value: boolean) => void;
}

export function useReasoningDisclosure({
  open,
  streaming,
  disabled,
  autoOpen,
  autoClose,
  onOpenChange,
}: ReasoningDisclosure) {
  const previous = useRef<boolean>(undefined);
  const manual = useRef(false);
  useEffect(() => {
    const before = previous.current;
    previous.current = streaming;
    if (before === streaming) return;
    if (streaming) {
      manual.current = false;
      if (autoOpen && !disabled && !open) onOpenChange(true);
    } else if (before === true && autoClose && !disabled && !manual.current && open) {
      onOpenChange(false);
    }
  }, [streaming, open, disabled, autoOpen, autoClose, onOpenChange]);

  return (value: boolean) => {
    manual.current = true;
    onOpenChange(value);
  };
}
