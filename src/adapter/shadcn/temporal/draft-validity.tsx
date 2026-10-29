import { useEffect } from 'react';
import { DATE_TIME_POLICY } from '../../../core/date-time-policy.js';
import { focusIncompleteSegment } from './focus-incomplete-segment.js';

interface TemporalDraftValidityProps {
  readonly segments: readonly {
    readonly isEditable: boolean;
    readonly isPlaceholder: boolean;
  }[];
  readonly required?: boolean | undefined;
  readonly value: string | null;
  readonly disabled?: boolean | undefined;
  readonly root: HTMLElement | null;
  readonly onInvalidChange: (invalid: boolean) => void;
}

export function TemporalDraftValidity({
  segments,
  required,
  value,
  disabled,
  root,
  onInvalidChange,
}: TemporalDraftValidityProps) {
  const missing = segments.some(
    (segment) => segment.isEditable && segment.isPlaceholder,
  );
  const filled = segments.some(
    (segment) => segment.isEditable && !segment.isPlaceholder,
  );
  const partial = missing && filled;
  useEffect(() => {
    if (!missing || (!filled && !required && value === null)) onInvalidChange(false);
  }, [missing, filled, required, value, onInvalidChange]);
  return (
    <input
      type="text"
      hidden
      required={required || partial || value !== null}
      disabled={disabled}
      value={missing ? '' : DATE_TIME_POLICY.completeDraftValue}
      onChange={() => undefined}
      onInvalid={(event) => {
        event.preventDefault();
        onInvalidChange(true);
        focusIncompleteSegment(root);
      }}
    />
  );
}
